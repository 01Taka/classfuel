import React, { useEffect, useState, useCallback } from 'react'
import { IconButton, LinearProgress, Typography } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'

interface VoicePlayerProps {
  voiceBase64: string
}

const VoicePlayer: React.FC<VoicePlayerProps> = ({ voiceBase64 }) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [remainingTime, setRemainingTime] = useState(0)

  useEffect(() => {
    const newAudio = new Audio(voiceBase64)
    setAudio(newAudio)
    return () => {
      newAudio.pause()
      newAudio.src = ''
    }
  }, [voiceBase64])

  const updateProgress = useCallback(() => {
    if (audio && isFinite(audio.duration)) {
      setProgress((audio.currentTime / audio.duration) * 100)
      setRemainingTime(
        Math.max(0, Math.floor(audio.duration - audio.currentTime))
      )
    }
  }, [audio])

  const handleEnd = useCallback(() => {
    setIsPlaying(false)
    setProgress(0)
    setRemainingTime(audio?.duration ? Math.floor(audio.duration) : 0)
  }, [audio])

  useEffect(() => {
    if (!audio) return
    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', handleEnd)
    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('ended', handleEnd)
    }
  }, [audio, updateProgress, handleEnd])

  const handleTogglePlay = () => {
    if (!audio) return
    isPlaying ? audio.pause() : audio.play()
    setIsPlaying(!isPlaying)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <IconButton onClick={handleTogglePlay} size="small">
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ flexGrow: 1, mx: 1 }}
      />
      <Typography variant="caption">{Math.round(remainingTime)}s</Typography>
    </div>
  )
}

export default VoicePlayer
