import { Fab, FabProps, SxProps } from '@mui/material'
import React from 'react'

interface FAButtonProps extends FabProps {
  children?: React.ReactNode
  variant?: 'extended' | 'circular'
  diameter?: number
  sx?: SxProps
}

const FAButton: React.FC<FAButtonProps> = ({
  children,
  variant = 'circular',
  diameter = 56,
  sx,
  ...props
}) => {
  return (
    <Fab
      {...props}
      variant={variant}
      sx={{ ...sx, width: diameter, height: diameter }}
    >
      {children}
    </Fab>
  )
}

export default FAButton
