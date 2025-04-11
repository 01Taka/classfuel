import { Typography } from '@mui/material'
import React from 'react'
import { formatTime } from '../../functions/dateTime-utils/time-format-utils'

interface TimerDisplayProps {
  timeMs: number
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeMs }) => {
  return <Typography variant="h3">{formatTime(timeMs)}</Typography>
}

export default TimerDisplay
