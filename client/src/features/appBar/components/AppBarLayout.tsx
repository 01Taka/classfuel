// src/features/appBar/components/organisms/AppBarLayout.tsx
import React from 'react'
import { AppBar, Toolbar } from '@mui/material'
import Popup from '../../../components/molecules/Popup'
import CreateTeamForm from '../../team/components/CreateTeam'
import JoinTeamLayout from '../../team/components/JoinTeamLayout'
import { useAppBarState } from '../hooks/useAppBarState'
import { UserActions } from './UserActions'
import { TeamDropdownMenu } from '../../team/components/TeamDropdownMenu'
import { useCurrentUserStore } from '../../../stores/currentUserStore'

export const AppBarLayout: React.FC = () => {
  const { user } = useCurrentUserStore()
  const { popupType, setPopupType, teams, changeTeam, joinTeam } =
    useAppBarState()

  return (
    <AppBar position="fixed" sx={{ top: 0 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <TeamDropdownMenu
          teams={teams}
          currentTeamId={user?.activeTeamId ?? null}
          onChangeTeam={changeTeam}
          onCreateTeam={() => setPopupType('create')}
          onJoinTeam={() => setPopupType('join')}
        />
        <UserActions />
      </Toolbar>

      <Popup
        open={!!popupType}
        onClose={() => setPopupType(null)}
        sx={{ bgcolor: 'white' }}
        justifyContent="start"
      >
        {popupType === 'join' && (
          <JoinTeamLayout
            teams={teams}
            onQrCodeScan={joinTeam}
            onTeamIdInput={joinTeam}
          />
        )}
        {popupType === 'create' && (
          <CreateTeamForm onSuccess={() => setPopupType(null)} />
        )}
      </Popup>
    </AppBar>
  )
}

export default AppBarLayout
