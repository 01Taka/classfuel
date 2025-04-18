// hooks/useInitUser.ts
import { useEffect, useCallback, useMemo } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { UserRepository } from '../../firebase/firestore/repositories/users/user-repository'
import { useCurrentUserStore } from '../../stores/currentUserStore'
import { UserJoinedTeamRepository } from '../../firebase/firestore/repositories/users/user-joined-team-repository'
import { useJoinedTeamsStore } from '../../stores/joinedTeamsStore'

const userRepo = new UserRepository()
const userJoinedTeamsRepo = new UserJoinedTeamRepository()

const useInitUser = () => {
  const auth = getAuth()
  const [firebaseUser, loading, error] = useAuthState(auth)
  const { setUid, setUser, setLoading, setError } = useCurrentUserStore()

  const { setJoinedTeams } = useJoinedTeamsStore()

  const uid = useMemo(() => firebaseUser?.uid ?? null, [firebaseUser])

  const fetchUser = useCallback(async () => {
    if (!uid) return
    try {
      const userData = await userRepo.read(uid)
      setUser(userData)

      const teams = await userJoinedTeamsRepo.getAll([uid])
      setJoinedTeams(teams)
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

    const { unsubscribe } = userRepo.addCallback((snapshot) => {
      setUser(snapshot.data() ?? null)
    }, uid)

    return () => unsubscribe()
  }, [uid, loading, error, fetchUser, setUid, setLoading, setError, setUser])

  useEffect(() => {
    if (!uid) return
    const { unsubscribe } = userJoinedTeamsRepo.addReadCollectionCallback(
      (teams) => {
        setJoinedTeams(teams)
      },
      [uid]
    )
    return () => unsubscribe()
  }, [uid])
}

export default useInitUser
