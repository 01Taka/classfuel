import React from 'react'
import SessionTimer from '../../features/session/components/SessionTimer'
import { Stack } from '@mui/material'

interface SessionScreenLayoutProps {}

const SessionScreenLayout: React.FC<SessionScreenLayoutProps> = ({}) => {
  return (
    <Stack
      spacing={3}
      height={'100vh'}
      width={'100vw'}
      alignItems="center"
      justifyContent="center"
    >
      <SessionTimer />
    </Stack>
  )
}

export default SessionScreenLayout
