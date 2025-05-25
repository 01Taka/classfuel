import React from 'react'
import MapCell from './MapCell'
import { Stack } from '@mui/material'

interface MapCellsProps {
  cells: number[]
  cellSize?: number
  gap?: number
}

const MapCells: React.FC<MapCellsProps> = ({ cells, cellSize, gap = 2 }) => {
  return (
    <Stack
      flexDirection="row"
      gap={gap}
      alignItems="center"
      justifyContent="center"
      sx={{ width: '100%' }}
    >
      {cells.map((cellId) => (
        <MapCell key={cellId} cellId={cellId} size={cellSize} color="#e0f7fa" />
      ))}
    </Stack>
  )
}

export default MapCells
