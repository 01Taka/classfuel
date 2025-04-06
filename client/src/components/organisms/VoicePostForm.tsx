import React, { useState } from 'react'
import { Stack, Button, Typography } from '@mui/material'
import VisibilitySelector from '../atoms/VisibilitySelector'
import useAudioRecorder from '../../hooks/useAudioRecorder'
import RecordButton from '../atoms/RecordButton'
import { Visibility } from '../../types/firebase/util-document-types'

interface VoicePostFormProps {
  onPost: (data: { voiceBlob: Blob; visibility: Visibility }) => void
}

const VoicePostForm: React.FC<VoicePostFormProps> = ({ onPost }) => {
  const { audioBlob, isRecording, switchRecording } = useAudioRecorder()
  const [visibility, setVisibility] = useState<Visibility>('public')

  const handlePost = () => {
    if (audioBlob) {
      onPost({ voiceBlob: audioBlob, visibility })
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6">新しい応援ボイスを投稿</Typography>
      <RecordButton isRecording={isRecording} onClick={switchRecording} />
      {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} />}
      <VisibilitySelector value={visibility} onChange={setVisibility} />
      <Button
        variant="contained"
        color="primary"
        onClick={handlePost}
        disabled={!audioBlob}
      >
        投稿する
      </Button>
    </Stack>
  )
}

export default VoicePostForm
