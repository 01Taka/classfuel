import { useState } from 'react'
import { AsyncState, AsyncStatus } from '../../types/form/async-handler-types'

const useAsyncHandler = <T = void>() => {
  const [asyncStatus, setAsyncStatus] = useState<AsyncStatus>('idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const logError = (error: unknown, userMessage?: string) => {
    console.error(error)
    if (userMessage !== undefined) setErrorMessage(userMessage)
    if (error instanceof Error) {
      setError(error)
    }
    setAsyncStatus('error')
  }

  const setDataOnSuccess = (data: T) => {
    setAsyncStatus('success')
    setData(data)
  }

  const reset = () => {
    setAsyncStatus('idle')
    setData(null)
    setError(null)
    setErrorMessage('')
  }

  const startLoading = () => {
    setAsyncStatus('loading')
  }

  // 改善されたcallAsyncFunction
  const callAsyncFunction = async <A extends any[]>(
    func: (...args: A) => Promise<T>,
    args: A,
    onFailedMessage?: string
  ): Promise<AsyncState<T> & { isSuccess: boolean }> => {
    startLoading()
    try {
      const result = await func(...args)
      setDataOnSuccess(result)
      const state: AsyncState<T> = {
        status: 'success',
        data: result,
        error: null,
        errorMessage: '',
      }
      return { ...state, isSuccess: true }
    } catch (error) {
      logError(error, onFailedMessage)
      const state: AsyncState<T> = {
        status: 'error',
        data: null,
        error: error instanceof Error ? error : null,
        errorMessage: onFailedMessage ?? '',
      }
      return { ...state, isSuccess: false }
    }
  }

  return {
    asyncStatus,
    data,
    error,
    errorMessage,
    startLoading,
    setDataOnSuccess,
    logError,
    reset,
    callAsyncFunction,
  }
}

export default useAsyncHandler
