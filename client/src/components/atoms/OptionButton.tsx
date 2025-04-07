import { Button } from '@mui/material'
import React from 'react'

interface OptionButtonProps {
  text: string
  color: string
  onClick: () => void
}

const OptionButton: React.FC<OptionButtonProps> = ({
  text,
  color,
  onClick,
}) => {
  return (
    <Button
      variant="outlined"
      sx={{ bgcolor: color, color: 'black', width: '80%', boxShadow: 1 }}
      onClick={onClick}
    >
      {text}
    </Button>
  )
}

export default OptionButton
