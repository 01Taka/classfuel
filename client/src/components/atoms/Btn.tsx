import { Button, ButtonProps, SxProps, Theme } from '@mui/material'
import React, { ReactNode } from 'react'

interface BtnProps extends ButtonProps {
  children: ReactNode
  variant?: 'text' | 'outlined' | 'contained'
  sx?: SxProps<Theme>
}

const Btn: React.FC<BtnProps> = ({
  children,
  variant = 'outlined',
  sx,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      disableElevation
      sx={{
        boxShadow: 2,
        textTransform: 'none',
        fontWeight: 600,
        px: 2.5,
        py: 1.2,
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-1px)',
        },
        '&:disabled': {
          opacity: 0.6,
          pointerEvents: 'none',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  )
}

export default Btn
