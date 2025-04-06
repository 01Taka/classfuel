import { BottomNavigation, Paper } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import BottomNavAction from '../molecules/BottomNavAction'
import { NavItem } from '../../types/components/navigation-type'

interface BottomNavigationBarProps {
  items: NavItem[]
}

const BottomNavigationBar = ({ items }: BottomNavigationBarProps) => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        value={location.pathname}
        onChange={(_, newValue) => navigate(newValue)}
      >
        {items.map((item) => (
          <BottomNavAction
            key={item.value}
            label={item.label}
            icon={item.icon}
            value={item.value}
          />
        ))}
      </BottomNavigation>
    </Paper>
  )
}

export default BottomNavigationBar
