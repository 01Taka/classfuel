import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import { NavItem } from '../types/components/navigation-type'
import { VoiceChat } from '@mui/icons-material'

export const defaultNavItems: NavItem[] = [
  { label: 'Home', icon: <HomeIcon />, value: '/' },
  { label: 'ボイス', icon: <VoiceChat />, value: '/voice-share' },
  { label: 'Profile', icon: <PersonIcon />, value: '/profile' },
]
