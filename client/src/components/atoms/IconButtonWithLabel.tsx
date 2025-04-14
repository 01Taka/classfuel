import { Button, Typography } from '@mui/material'
import React, { ReactNode } from 'react'

interface IconButtonWithLabelProps {
  children: ReactNode
  label: string
  onClick?: () => void
}

const IconButtonWithLabel: React.FC<IconButtonWithLabelProps> = ({
  children,
  label,
  onClick,
}) => {
  return (
    <Button
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        gap: 0.5,
      }}
      onClick={onClick}
    >
      {children}
      <Typography variant="caption">{label}</Typography>
    </Button>
  )
}

export default IconButtonWithLabel
