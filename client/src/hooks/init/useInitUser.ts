// hooks/useInitUser.ts
import { useEffect, useCallback, useMemo } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { UserRepository } from '../../firebase/firestore/repositories/users/user-repository'
import { useCurrentUserStore } from '../../stores/user/currentUserStore'

const userRepo = new UserRepository()

const useInitUser = () => {
  const auth = getAuth()
  const [firebaseUser, loading, error] = useAuthState(auth)
  const { setUid, setUser, setLoading, setError } = useCurrentUserStore()

  const uid = useMemo(() => firebaseUser?.uid ?? null, [firebaseUser])

  const fetchUser = useCallback(async () => {
    if (!uid) return
    try {
      const userData = await userRepo.read([uid])
      setUser(userData)
    } catch (err) {
      setError(err as Error)
    }
  }, [uid, setUser, setError])

  useEffect(() => {
    setUid(uid)
    setLoading(loading)
    if (error) setError(error)
    if (!uid) return

    fetchUser()

    const { unsubscribe } = userRepo.addCallback(
      (snapshot) => {
        setUser(snapshot.data() ?? null)
      },
      [uid]
    )

    return () => unsubscribe()
  }, [uid, fetchUser, setUid, setLoading, setError, setUser])
}

export default useInitUser
