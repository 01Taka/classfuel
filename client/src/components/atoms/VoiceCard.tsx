import React from 'react'
import { Card, CardContent, Typography, IconButton } from '@mui/material'
import { PlayArrow } from '@mui/icons-material'
import { Voice } from '../../types/components/voice-types'

interface VoiceCardProps {
  voice: Voice
}

const VoiceCard: React.FC<VoiceCardProps> = ({ voice }) => {
  const handlePlay = () => {
    const audio = new Audio(voice.audioUrl)
    audio.play()
  }

  return (
    <Card
      variant="outlined"
      sx={{ display: 'flex', alignItems: 'center', p: 1 }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1">{voice.creatorName} の声</Typography>
      </CardContent>
      <IconButton onClick={handlePlay}>
        <PlayArrow />
      </IconButton>
    </Card>
  )
}

export default VoiceCard
