import { useCallback, useEffect, useMemo, useState } from 'react'
import { AsyncState, AsyncStatus } from '../../types/form/async-handler-types'

const useMultipleAsyncHandler = <StateTypes extends Record<string, any>>(
  keys?: (keyof StateTypes)[]
) => {
  const [asyncStates, setAsyncStates] = useState<{
    [K in keyof StateTypes]?: AsyncState<StateTypes[K]>
  }>({})
  const [globalError, setGlobalError] = useState<{
    error: unknown
    message: string | null
  }>({ error: null, message: null })

  const initializeState = useCallback(
    <K extends keyof StateTypes>() => ({
      status: 'idle' as AsyncStatus,
      data: null as StateTypes[K] | null,
      error: null,
      errorMessage: '',
    }),
    []
  )

  const memoizedKeys = useMemo(() => keys, [JSON.stringify(keys)])

  useEffect(() => {
    if (memoizedKeys) {
      const initialStates = memoizedKeys.reduce(
        (acc, key) => {
          acc[key] = initializeState()
          return acc
        },
        {} as { [K in keyof StateTypes]?: AsyncState<StateTypes[K]> }
      )
      setAsyncStates(initialStates)
    }
  }, [memoizedKeys, initializeState])

  const allMatchStates: AsyncStatus | 'noItems' | 'noMatch' = useMemo(() => {
    const status = Object.values(asyncStates)

    if (status.length === 0) return 'noItems'

    const targetStatus = status[0]?.status as AsyncStatus
    const isMatchAll = status.every((state) => state?.status === targetStatus)

    return isMatchAll ? targetStatus : 'noMatch'
  }, [asyncStates])

  const setAsyncStatesMemo = useCallback(
    (update: (prev: typeof asyncStates) => typeof asyncStates) => {
      setAsyncStates((prev) => update(prev))
    },
    []
  )

  const logError = useCallback(
    <K extends keyof StateTypes>(
      key: K,
      error: unknown,
      userMessage?: string
    ) => {
      console.error(error)

      setAsyncStatesMemo((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          status: 'error',
          error: error instanceof Error ? error : null,
          errorMessage: userMessage ?? '',
        } as AsyncState<StateTypes[K]>,
      }))

      setGlobalError({
        error,
        message: userMessage ?? (error instanceof Error ? error.message : null),
      })
    },
    [setAsyncStatesMemo]
  )

  const setDataOnSuccess = useCallback(
    <K extends keyof StateTypes>(key: K, data: StateTypes[K]) => {
      setAsyncStatesMemo((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          status: 'success',
          data,
          error: null,
          errorMessage: '',
        } as AsyncState<StateTypes[K]>,
      }))

      setGlobalError({ error: null, message: null })
    },
    [setAsyncStatesMemo]
  )

  const reset = useCallback(
    <K extends keyof StateTypes>(key: K) => {
      setAsyncStatesMemo((prev) => ({
        ...prev,
        [key]: initializeState(),
      }))

      setGlobalError({ error: null, message: null })
    },
    [setAsyncStatesMemo, initializeState]
  )

  const startLoading = useCallback(
    <K extends keyof StateTypes>(key: K) => {
      setAsyncStatesMemo((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          status: 'loading',
          error: null,
          errorMessage: '',
        } as AsyncState<StateTypes[K]>,
      }))
    },
    [setAsyncStatesMemo]
  )

  const callAsyncFunction = useCallback(
    async <K extends keyof StateTypes, A extends any[]>(
      key: K,
      func: (...args: A) => Promise<StateTypes[K]>,
      args: A,
      onFailedMessage?: string
    ): Promise<Awaited<StateTypes[K]> | null> => {
      setAsyncStatesMemo((prev) => {
        if (!prev[key]) {
          return { ...prev, [key]: initializeState() }
        }
        return prev
      })
      startLoading(key)
      try {
        const result = await func(...args)
        setDataOnSuccess(key, result)
        return result
      } catch (error) {
        logError(key, error, onFailedMessage)
        return null
      }
    },
    [
      initializeState,
      logError,
      setAsyncStatesMemo,
      setDataOnSuccess,
      startLoading,
    ]
  )

  const resetGlobalError = useCallback(() => {
    setGlobalError({ error: null, message: null })
  }, [])

  return {
    asyncStates,
    allMatchStates,
    globalError,
    logError,
    reset,
    setGlobalError,
    resetGlobalError,
    callAsyncFunction,
  }
}

export default useMultipleAsyncHandler
