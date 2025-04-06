import {
  BottomNavigationAction,
  BottomNavigationActionProps,
} from '@mui/material'
import { ReactElement } from 'react'

interface BottomNavActionProps extends BottomNavigationActionProps {
  label: string
  icon: ReactElement
  value: string
}

const BottomNavAction = ({
  label,
  icon,
  value,
  ...props
}: BottomNavActionProps) => {
  return (
    <BottomNavigationAction
      label={label}
      icon={icon}
      value={value}
      {...props}
    />
  )
}

export default BottomNavAction
