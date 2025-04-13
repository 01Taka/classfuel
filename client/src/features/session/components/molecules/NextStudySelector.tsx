import React from 'react'
import {
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Stack,
} from '@mui/material'

type Props = {
  value: number
  options: number[]
  onChange: (value: number) => void
}

const NextStudySelector: React.FC<Props> = ({ value, options, onChange }) => {
  return (
    <Stack alignItems="center" spacing={1}>
      <Typography>次の学習時間</Typography>
      <ToggleButtonGroup value={value} exclusive>
        {options.map((ms) => (
          <ToggleButton key={ms} value={ms} onClick={() => onChange(ms)}>
            {Math.floor(ms / 60000)}分
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  )
}

export default NextStudySelector
