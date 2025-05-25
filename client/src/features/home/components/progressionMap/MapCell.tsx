import { Stack, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import React from 'react'

interface MapCellProps {
  cellId: number
  color: string
  size?: number
}

const MapCell: React.FC<MapCellProps> = ({ cellId, color, size = 64 }) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ width: size, height: size, bgcolor: color, borderRadius: 2 }}
    >
      <Typography variant="h3" pt={5} color={blue[900]}>
        {cellId}
      </Typography>
    </Stack>
  )
}

export default MapCell
