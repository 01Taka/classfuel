import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getMemberData,
  handleFetchTeamByCode,
  handleJoinTeam,
} from '../../functions/services/team-services'
import { TeamRead } from '../../types/firebase/firestore-documents/teams/team-document'

import { Box, Container } from '@mui/material'
import NotFoundMessage from '../../features/join-team/components/NotFoundMessage'
import TeamPreview from '../../features/join-team/components/TeamPreview'
import LoadingIndicator from '../atoms/LoadingIndicator'
import { useCurrentUserStore } from '../../stores/currentUserStore'

const JoinTeam: React.FC = () => {
  const navigate = useNavigate()
  const { uid, user } = useCurrentUserStore()
  const { code } = useParams<{ code: string }>()
  const [team, setTeam] = useState<TeamRead | null>(null)
  const [state, setState] = useState<'idle' | 'loading' | 'error' | 'success'>(
    'idle'
  )
  const [isParticipated, setIsParticipated] = useState(false)

  useEffect(() => {
    const fetchTeam = async () => {
      console.log('fetch')

      if (!code) {
        setState('error')
        return
      }
      setState('loading')
      const fetchedTeam = await handleFetchTeamByCode(code)
      if (fetchedTeam) {
        setTeam(fetchedTeam)
        setState('success')
      } else {
        setState('error')
      }
    }
    fetchTeam()
  }, [code])

  useEffect(() => {
    const checkIfParticipated = async () => {
      if (team && uid) {
        const member = await getMemberData(uid, team.docId)
        setIsParticipated(!!member)
      }
    }
    checkIfParticipated()
  }, [team, uid])

  const handleJoin = async () => {
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
  }

  return (
    <Container maxWidth="sm">
      <Box mt={6}>
        {state === 'loading' && <LoadingIndicator />}
        {state === 'error' && <NotFoundMessage code={code ?? ''} />}
        {state === 'success' && team && (
          <TeamPreview
            isParticipated={isParticipated}
            team={team}
            onJoinTeam={() => handleJoin()}
          />
        )}
      </Box>
    </Container>
  )
}

export default JoinTeam
