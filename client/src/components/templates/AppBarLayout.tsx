import { AppBar, Toolbar, Box, IconButton } from '@mui/material'
import React from 'react'
import { TeamDropdownMenu } from '../organisms/TeamDropdownMenu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { QrCode } from '@mui/icons-material'

interface AppBarLayoutProps {}

const AppBarLayout: React.FC<AppBarLayoutProps> = ({}) => {
  const teams = [
    { id: '1', name: 'Team A' },
    { id: '2', name: 'Team B' },
  ]
  const currentTeamId = '1'
  const onChangeTeam = (id: string) => {
    console.log('Change team to:', id)
  }
  const onCreateTeam = () => {
    console.log('Create team')
  }
  const onJoinTeam = () => {
    console.log('Join team')
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
            onCreateTeam={onCreateTeam}
            onJoinTeam={onJoinTeam}
          />
          <IconButton>
            <QrCode sx={{ color: 'white' }} />
          </IconButton>
        </Box>

        {/* Right: User actions */}
        <Box display="flex" gap={2} alignItems="center">
          <NotificationsIcon />
          <AccountCircleIcon />
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default AppBarLayout
