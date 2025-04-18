import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from '@mui/material'
import React from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
  label: string
  name: string
  value: string
  options: SelectOption[]
}

/**
 * 共通セレクトボックスコンポーネント
 */
const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  value,
  options,
  ...rest
}) => {
  const labelId = `${name}-label`

  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        id={name}
        name={name}
        value={value}
        label={label}
        {...rest}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default FormSelect
