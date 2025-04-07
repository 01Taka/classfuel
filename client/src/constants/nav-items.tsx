import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import { NavItem } from '../types/components/navigation-types'
import { Chat } from '@mui/icons-material'

export const defaultNavItems: NavItem[] = [
  { label: 'Home', icon: <HomeIcon />, value: '/' },
  { label: 'チャット', icon: <Chat />, value: '/chat' },
  { label: 'Profile', icon: <PersonIcon />, value: '/profile' },
]
