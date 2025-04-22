import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCurrentUserStore } from '../../../stores/user/currentUserStore'
import { TeamRead } from '../../../types/firebase/firestore-documents/teams/team-document'
import {
  getTeamMemberData,
  handleFetchTeamByCode,
  handleJoinTeam,
} from '../services/team-services'

type Status = 'idle' | 'loading' | 'error' | 'success'

export const useJoinTeam = () => {
  const { code } = useParams<{ code: string }>()
  console.log(code)

  const navigate = useNavigate()
  const { uid, user } = useCurrentUserStore()

  const [team, setTeam] = useState<TeamRead | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [isParticipated, setIsParticipated] = useState(false)

  // 1) チーム情報フェッチ
  useEffect(() => {
    if (!code) {
      setStatus('error')
      return
    }
    setStatus('loading')
    handleFetchTeamByCode(code)
      .then((fetched) => {
        if (fetched) {
          setTeam(fetched)
          setStatus('success')
        } else {
          setStatus('error')
        }
      })
      .catch(() => setStatus('error'))
  }, [code])

  // 2) 参加済みチェック
  useEffect(() => {
    if (team && uid) {
      getTeamMemberData(uid, team.docId).then((member) =>
        setIsParticipated(!!member)
      )
    }
  }, [team, uid])

  // 3) 参加アクション
  const handleJoin = useCallback(async () => {
    if (!code) return
    if (!uid) {
      navigate(`/login?team-code=${code}`)
      return
    }
    if (!user) {
      navigate(`/user-setup?team-code=${code}`)
      return
    }
    await handleJoinTeam({ ...user, todayStudyTime: 0 }, code)
    navigate('/')
  }, [code, uid, user, navigate])

  return { team, code, status, isParticipated, handleJoin }
}
