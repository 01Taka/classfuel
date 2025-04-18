import { useEffect, useState } from 'react'
import { TeamRepository } from '../../../firebase/firestore/repositories/teams/team-repository'
import { UserJoinedTeamRepository } from '../../../firebase/firestore/repositories/users/user-joined-team-repository'
import { handleJoinTeam } from '../../join-team/services/team-services'
import { useCurrentUserStore } from '../../../stores/currentUserStore'
import { TeamRead } from '../../../types/firebase/firestore-documents/teams/team-document'
import {
  extractTeamCode,
  isRogueFirestoreId,
} from '../../../functions/team-code-utils'

const userJoinedTeamRepo = new UserJoinedTeamRepository()
const teamRepo = new TeamRepository()

export const useAppBarState = () => {
  const { uid, user } = useCurrentUserStore()

  const [popupType, setPopupType] = useState<'join' | 'create' | null>(null)
  const [joinedTeams, setJoinedTeams] = useState<string[]>([])
  const [teams, setTeams] = useState<TeamRead[]>([])

  // 1) ユーザー参加チームIDを取得
  useEffect(() => {
    if (!uid) return
    userJoinedTeamRepo
      .getAll([uid])
      .then((docs) => setJoinedTeams(docs.map((d) => d.docId)))
  }, [uid])

  // 2) チーム詳細を取得
  useEffect(() => {
    if (joinedTeams.length === 0) return
    Promise.all(joinedTeams.map((id) => teamRepo.read(id))).then((res) =>
      setTeams(res.filter(Boolean) as TeamRead[])
    )
  }, [joinedTeams])

  // チーム切替
  const changeTeam = async (teamId: string) => {
    if (!uid) return
    await userJoinedTeamRepo.update({ activeTeamId: teamId }, uid)
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
