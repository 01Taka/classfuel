import { AppBar, Toolbar, Box } from '@mui/material'
import React from 'react'
import { TeamDropdownMenu } from '../organisms/TeamDropdownMenu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import JoinTeam from '../organisms/JoinTeam'
import Popup from '../molecules/Popup'
import CreateTeam from '../organisms/CreateTeam'

interface AppBarLayoutProps {}

const teams = [
  { id: '1', name: 'Team A' },
  { id: '2', name: 'Team B' },
]

const AppBarLayout: React.FC<AppBarLayoutProps> = ({}) => {
  const [openPopupType, setOpenPopupType] = React.useState<
    'join' | 'create' | null
  >(null)

  const currentTeamId = '1'
  const onChangeTeam = (id: string) => {
    console.log('Change team to:', id)
  }

  return (
    <AppBar sx={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left: Team selector */}
        <Box>
          <TeamDropdownMenu
            teams={teams}
            currentTeamId={currentTeamId}
            onChangeTeam={onChangeTeam}
            onCreateTeam={() => setOpenPopupType('create')}
            onJoinTeam={() => setOpenPopupType('join')}
          />
        </Box>

        {/* Right: User actions */}
        <Box display="flex" gap={2} alignItems="center">
          <NotificationsIcon />
          <AccountCircleIcon />
        </Box>
      </Toolbar>
      <Popup onClose={() => setOpenPopupType(null)} sx={{ bgcolor: 'white' }}>
        {openPopupType &&
          (openPopupType === 'join' ? (
            <JoinTeam />
          ) : (
            <CreateTeam onSuccess={() => setOpenPopupType(null)} />
          ))}
      </Popup>
    </AppBar>
  )
}

export default AppBarLayout
