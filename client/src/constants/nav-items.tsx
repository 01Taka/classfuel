import HomeIcon from '@mui/icons-material/Home'
import Chat from '@mui/icons-material/Search'
import PersonIcon from '@mui/icons-material/Person'
import { NavItem } from '../types/components/navigation-type'

export const defaultNavItems: NavItem[] = [
  { label: 'Home', icon: <HomeIcon />, value: '/' },
  { label: 'チャット', icon: <Chat />, value: '/chat' },
  { label: 'Profile', icon: <PersonIcon />, value: '/profile' },
]
