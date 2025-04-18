// src/features/joinTeam/components/organisms/JoinTeamPage.tsx
import React from 'react'
import { Container, Box } from '@mui/material'
import NotFoundMessage from '../../features/join-team/components/NotFoundMessage'
import TeamPreview from '../../features/join-team/components/TeamPreview'
import { useJoinTeam } from '../../features/join-team/hooks/useJoinTeam'
import LoadingIndicator from '../atoms/LoadingIndicator'

const JoinTeamPage: React.FC = () => {
  const { team, status, isParticipated, handleJoin } = useJoinTeam()

  return (
    <Container maxWidth="sm">
      <Box mt={6}>
        {status === 'loading' && <LoadingIndicator />}
        {status === 'error' && <NotFoundMessage code={team?.docId ?? ''} />}
        {status === 'success' && team && (
          <TeamPreview
            team={team}
            isParticipated={isParticipated}
            onJoinTeam={handleJoin}
          />
        )}
      </Box>
    </Container>
  )
}

export default JoinTeamPage
