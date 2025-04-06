import React from 'react'
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'
import { Visibility } from '../../types/firebase/util-document-types'

interface VisibilitySelectorProps {
  value: Visibility
  onChange: (value: Visibility) => void
}

const VisibilitySelector: React.FC<VisibilitySelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <FormControl>
      <FormLabel>公開範囲</FormLabel>
      <RadioGroup
        row
        value={value}
        onChange={(e) => onChange(e.target.value as Visibility)}
      >
        <FormControlLabel value="public" control={<Radio />} label="公開" />
        <FormControlLabel value="private" control={<Radio />} label="非公開" />
      </RadioGroup>
    </FormControl>
  )
}

export default VisibilitySelector
