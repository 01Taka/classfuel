import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { UserRead } from '../types/firebase/firestore-documents/user/user-document'
import useUserService from './useUsers'

const useCurrentUser = () => {
  const auth = getAuth()
  const [firebaseUser, loading, error] = useAuthState(auth)
  const [user, setUser] = useState<UserRead | null>(null)
  const { fetchUserById } = useUserService()

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

  return { user, loading, error }
}

export default useCurrentUser
