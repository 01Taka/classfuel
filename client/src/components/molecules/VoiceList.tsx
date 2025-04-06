import React from 'react'
import { Stack, Typography } from '@mui/material'
import { Voice } from '../../types/components/voice-type'
import VoiceCard from '../atoms/VoiceCard'

interface VoiceListProps {
  voices: Voice[]
}

const VoiceList: React.FC<VoiceListProps> = ({ voices }) => {
  if (voices.length === 0) {
    return <Typography>まだ応援ボイスがありません</Typography>
  }

  return (
    <Stack spacing={2}>
      {voices.map((voice) => (
        <VoiceCard key={voice.id} voice={voice} />
      ))}
    </Stack>
  )
}

export default VoiceList
