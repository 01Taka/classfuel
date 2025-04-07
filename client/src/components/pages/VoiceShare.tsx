import React from 'react'
import { Container, Divider, Typography } from '@mui/material'
import VoiceList from '../molecules/VoiceList'
import BottomNavigationBar from '../organisms/BottomNavigationBar'
import VoicePostForm from '../organisms/VoicePostForm'
import { defaultNavItems } from '../../constants/nav-items'
import useVoiceMessages from '../../features/voice-share/hooks/useVoiceMessages.ts'

const VoiceShare: React.FC = () => {
  const { voices, postVoice } = useVoiceMessages()

  return (
    <>
      <Container sx={{ mt: 4 }}>
        <VoicePostForm onPost={postVoice} />
        <Divider sx={{ my: 4 }} />
        <Typography variant="h5" gutterBottom>
          応援ボイス一覧
        </Typography>
        <VoiceList voices={voices} />
      </Container>
      <BottomNavigationBar items={defaultNavItems} />
    </>
  )
}

export default VoiceShare
