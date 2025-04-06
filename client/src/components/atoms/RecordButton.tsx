import React from 'react'
import { Button } from '@mui/material'

interface RecordButtonProps {
  isRecording: boolean
  onClick: () => void
}

const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  onClick,
}) => {
  return (
    <Button
      variant={isRecording ? 'contained' : 'outlined'}
      color="primary"
      onClick={onClick}
    >
      {isRecording ? '録音停止' : '録音開始'}
    </Button>
  )
}

export default RecordButton
