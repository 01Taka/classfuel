import React from 'react'
import { ButtonGroup, Stack, Typography } from '@mui/material'
import Btn from '../../../../components/atoms/Btn'

type Props = {
  breakTimeChoices: number[]
  onBreak: (ms: number) => void
}

const BreakSelector: React.FC<Props> = ({ breakTimeChoices, onBreak }) => {
  return (
    <Stack alignItems={'center'} spacing={1}>
      <Typography>休憩する</Typography>
      <ButtonGroup>
        {breakTimeChoices.map((ms) => (
          <Btn key={ms} onClick={() => onBreak(ms)}>
            {Math.floor(ms / 60000)}分
          </Btn>
        ))}
      </ButtonGroup>
    </Stack>
  )
}

export default BreakSelector
