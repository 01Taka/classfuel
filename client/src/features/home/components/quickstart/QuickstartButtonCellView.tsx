import { Box, Stack } from '@mui/material'
import React from 'react'

interface QuickstartButtonCellViewProps {
  cellNumber: number
  cellSize?: number
  color?: string
  gap?: number
}

const QuickstartButtonCellView: React.FC<QuickstartButtonCellViewProps> = ({
  cellNumber,
  cellSize = 64,
  color,
  gap = 2,
}) => {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      gap={gap}
      flexWrap="wrap"
      sx={{
        maxWidth: '80%',
      }}
    >
      {Array.from({ length: cellNumber }, (_, index) => (
        <Box
          key={index}
          sx={{
            width: cellSize,
            height: cellSize,
            bgcolor: color,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      ))}
    </Stack>
  )
}

export default QuickstartButtonCellView
