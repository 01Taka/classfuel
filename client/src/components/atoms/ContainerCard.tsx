import { Card, CardContent, SxProps, Theme } from '@mui/material'
import React, { ReactNode } from 'react'

interface ContainerCardProps {
  children: ReactNode
  sx?: SxProps<Theme>
  contentSx?: SxProps<Theme>
}

const ContainerCard: React.FC<ContainerCardProps> = ({
  children,
  sx,
  contentSx,
}) => {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
        backgroundColor: '#F5F5F5',
        ...sx,
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          ...contentSx,
        }}
      >
        {children}
      </CardContent>
    </Card>
  )
}

export default ContainerCard
