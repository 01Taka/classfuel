import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'

interface IconWithLabelProps {
  src: string
  label: string
  size?: number
}

const IconWithLabel: React.FC<IconWithLabelProps> = ({
  src,
  label,
  size = 48,
}) => {
  return (
    <Stack justifyContent="center" alignItems="center" spacing={0.5}>
      <Avatar src={src} sx={{ width: size, height: size }} />
      <Typography variant="body1" fontWeight={600}>
        {label}
      </Typography>
    </Stack>
  )
}

export default IconWithLabel
