import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { useEffect, useMemo, useState } from 'react'
import { UserRead } from '../types/firebase/firestore-documents/users/user-document'
import useUserService from './useUsers'

const useCurrentUser = () => {
  const auth = getAuth()
  const [firebaseUser, loading, error] = useAuthState(auth)
  const [user, setUser] = useState<UserRead | null>(null)
  const { fetchUserById } = useUserService()

  const uid = useMemo(() => firebaseUser?.uid ?? null, [firebaseUser])

  useEffect(() => {
    if (!firebaseUser) {
      setUser(null)
      return
    }

    const fetch = async () => {
      const userData = await fetchUserById(firebaseUser.uid)
      setUser(userData)
    }

    fetch()
  }, [firebaseUser?.uid])

  return { uid, user, loading, error }
}

export default useCurrentUser
