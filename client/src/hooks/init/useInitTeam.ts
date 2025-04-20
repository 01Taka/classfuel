import { useCallback, useEffect } from 'react'
import { useCurrentUserStore } from '../../stores/currentUserStore'
import { UserJoinedTeamRepository } from '../../firebase/firestore/repositories/users/user-joined-team-repository'
import { useJoinedTeamsStore } from '../../stores/joinedTeamsStore'

const userJoinedTeamsRepo = new UserJoinedTeamRepository()

const useInitTeam = () => {
  const { uid } = useCurrentUserStore()
  const { setJoinedTeams } = useJoinedTeamsStore()

  const fetchTeam = useCallback(async (uid: string) => {
    const teams = await userJoinedTeamsRepo.getAll([uid])
    setJoinedTeams(teams)
  }, [])

  useEffect(() => {
    if (!uid) return

    fetchTeam(uid)

    const { unsubscribe } = userJoinedTeamsRepo.addReadCollectionCallback(
      (teams) => {
        setJoinedTeams(teams)
      },
      [uid]
    )
    return () => unsubscribe()
  }, [uid])
}

export default useInitTeam
