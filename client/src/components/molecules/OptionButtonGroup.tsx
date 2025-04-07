import React from 'react'
import { Stack } from '@mui/material'
import OptionButton from '../atoms/OptionButton'

export interface OptionChoices {
  id: string
  text: string
  color?: string
}

interface OptionButtonGroupProps {
  options: OptionChoices[]
  onClick: (option: OptionChoices) => void
}

const OptionButtonGroup: React.FC<OptionButtonGroupProps> = ({
  options,
  onClick,
}) => {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={1}
      width={'100%'}
    >
      {options.map((option, index) => (
        <OptionButton
          key={index}
          text={option.text}
          color={option.color ?? ''}
          onClick={() => onClick(option)}
        />
      ))}
    </Stack>
  )
}

export default OptionButtonGroup
