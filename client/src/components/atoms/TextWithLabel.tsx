import { Stack, Typography } from '@mui/material'
import React from 'react'

interface TextWithLabelProps {
  text: string
  label: string
}

const TextWithLabel: React.FC<TextWithLabelProps> = ({ text, label }) => {
  return (
    <Stack spacing={1} alignItems="center" justifyContent="center">
      <Typography>{label}</Typography>
      <Typography variant="h6">{text}</Typography>
    </Stack>
  )
}

export default TextWithLabel
