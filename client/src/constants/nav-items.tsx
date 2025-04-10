import HomeIcon from '@mui/icons-material/Home'
import { NavItem } from '../types/components/navigation-types'
import { History, MilitaryTech } from '@mui/icons-material'

export const defaultNavItems: NavItem[] = [
  { label: 'ホーム', icon: <HomeIcon />, value: '/' },
  { label: '履歴', icon: <History />, value: '/history' },
  { label: 'ランキング', icon: <MilitaryTech />, value: '/ranking' },
]
