import { Stack, Typography } from '@mui/material'
import React from 'react'
import Btn from './Btn'

interface StartButtonProps {
  timeMin: number
  explanation: string
  onClick?: () => void
}

const StartButton: React.FC<StartButtonProps> = ({
  timeMin,
  explanation,
  onClick,
}) => {
  return (
    <Btn onClick={onClick} fullWidth>
      <Stack direction="row" spacing={2}>
        <Typography fontWeight="bold">{timeMin}分</Typography>
        <Typography>{explanation}</Typography>
      </Stack>
    </Btn>
  )
}

export default StartButton
