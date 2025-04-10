import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'

interface AvatarWithNameProps {
  src: string
  userName: string
  size?: number
}

const AvatarWithName: React.FC<AvatarWithNameProps> = ({
  src,
  userName,
  size = 48,
}) => {
  return (
    <Stack justifyContent="center" alignItems="center" spacing={0.5}>
      <Avatar src={src} sx={{ width: size, height: size }} />
      <Typography variant="body1" fontWeight={600}>
        {userName}
      </Typography>
    </Stack>
  )
}

export default AvatarWithName
