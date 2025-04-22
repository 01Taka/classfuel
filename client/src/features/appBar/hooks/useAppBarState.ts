import { useEffect, useState } from 'react'
import { TeamRepository } from '../../../firebase/firestore/repositories/teams/team-repository'
import { handleJoinTeam } from '../../join-team/services/team-services'
import { useCurrentUserStore } from '../../../stores/user/currentUserStore'
import { TeamRead } from '../../../types/firebase/firestore-documents/teams/team-document'
import {
  extractTeamCode,
  isRogueFirestoreId,
} from '../../../functions/team-code-utils'
import { useJoinedTeamsStore } from '../../../stores/user/joinedTeamsStore'
import { UserRepository } from '../../../firebase/firestore/repositories/users/user-repository'

const userRepo = new UserRepository()
const teamRepo = new TeamRepository()

export const useAppBarState = () => {
  const { uid, user } = useCurrentUserStore()
  const { joinedTeams } = useJoinedTeamsStore()

  const [popupType, setPopupType] = useState<'join' | 'create' | null>(null)
  const [teams, setTeams] = useState<TeamRead[]>([])

  useEffect(() => {
    if (!joinedTeams || joinedTeams.length === 0) return
    Promise.all(joinedTeams.map((team) => teamRepo.read([team.docId]))).then(
      (res) => setTeams(res.filter(Boolean) as TeamRead[])
    )
  }, [joinedTeams])

  // チーム切替
  const changeTeam = async (teamId: string) => {
    if (!uid) return
    await userRepo.update({ activeTeamId: teamId }, [uid])
  }

  // 参加コード入力 or QRスキャン時
  const joinTeam = (input: string) => {
    if (!user) return
    const code = extractTeamCode(input)
    if (isRogueFirestoreId(code) || code.length !== 20) return
    handleJoinTeam({ ...user, todayStudyTime: 0 }, code)
  }

  return {
    popupType,
    setPopupType,
    teams,
    changeTeam,
    joinTeam,
  }
}
