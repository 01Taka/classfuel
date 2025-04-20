import React from 'react'
import { Avatar } from '@mui/material'

interface MedalAvatarProps {
  rank: number
}

const getMedalColor = (rank: number) => {
  switch (rank) {
    case 0:
      return '#FFD700' // Gold
    case 1:
      return '#C0C0C0' // Silver
    case 2:
      return '#CD7F32' // Bronze
    default:
      return 'transparent'
  }
}

const MedalAvatar: React.FC<MedalAvatarProps> = ({ rank }) => {
  const color = getMedalColor(rank)

  if (rank > 2) return null

  return (
    <Avatar
      sx={{
        width: 24,
        height: 24,
        fontSize: 14,
        bgcolor: color,
        color: '#fff',
      }}
    >
      {rank + 1}
    </Avatar>
  )
}

export default MedalAvatar
