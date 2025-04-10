import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
  SxProps,
  Theme,
} from '@mui/material'
import React from 'react'

export type ToggleValue = 'left' | 'right'

interface SwitchButtonProps
  extends Partial<Omit<ToggleButtonGroupProps, 'value' | 'onChange'>> {
  leftLabel: string
  rightLabel: string
  selectedValue: ToggleValue
  onChange: (value: ToggleValue) => void
  sx?: SxProps<Theme>
}

const SwitchButton: React.FC<SwitchButtonProps> = ({
  leftLabel,
  rightLabel,
  selectedValue,
  onChange,
  sx,
  size = 'medium',
  color = 'primary',
  ...groupProps
}) => {
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    value: ToggleValue | null
  ) => {
    if (value !== null) {
      onChange(value)
    }
  }

  const labels = [leftLabel, rightLabel]

  return (
    <ToggleButtonGroup
      value={selectedValue}
      exclusive
      onChange={handleChange}
      size={size}
      color={color}
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        overflow: 'hidden',
        ...sx,
      }}
      {...groupProps}
    >
      {labels.map((label, index) => (
        <ToggleButton
          key={index}
          value={index === 0 ? 'left' : 'right'}
          aria-label={label}
          sx={{
            fontWeight: 600,
            px: 3,
            py: 1.2,
            textTransform: 'none',
            '&.Mui-selected': {
              backgroundColor: `${color}.main`,
              color: 'white',
            },
            '&.Mui-selected:hover': {
              backgroundColor: `${color}.dark`,
            },
          }}
        >
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

export default SwitchButton
