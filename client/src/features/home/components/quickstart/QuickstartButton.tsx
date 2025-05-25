import { Button, Typography } from '@mui/material'
import React from 'react'
import QuickstartButtonCellView from './QuickstartButtonCellView'

interface QuickstartButtonProps {
  timeMinutes: number
  cellSize?: number
  cellGap?: number
  cellColor?: string
  buttonSize?: number
  buttonColor?: string
  onClick?: () => void
}

const QuickstartButton: React.FC<QuickstartButtonProps> = ({
  timeMinutes,
  cellSize,
  cellGap,
  cellColor,
  buttonSize = 100,
  buttonColor,
  onClick,
}) => {
  return (
    <Button
      variant="contained"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: buttonSize,
        height: buttonSize * 0.6,
        gap: 0.3,
        bgcolor: buttonColor,
        boxShadow: 4,
        border: 'blue solid 1px',
      }}
      size="small"
      onClick={onClick}
    >
      <Typography color={'#000'} variant="h6" fontWeight="bold">
        {timeMinutes}分
      </Typography>
      <QuickstartButtonCellView
        cellNumber={timeMinutes / 5}
        cellSize={cellSize}
        color={cellColor}
        gap={cellGap}
      />
    </Button>
  )
}

export default QuickstartButton
