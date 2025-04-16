import { AppBar, Toolbar, Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { TeamDropdownMenu } from '../organisms/team/TeamDropdownMenu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import JoinTeam from '../organisms/team/JoinTeam'
import Popup from '../molecules/Popup'
import CreateTeam from '../organisms/team/CreateTeam'
import { UserJoinedTeamRepository } from '../../firebase/firestore/repositories/users/user-joined-team-repository'
import { UserJoinedTeamRead } from '../../types/firebase/firestore-documents/users/user-joined-team-document'
import { useCurrentUserStore } from '../../stores/currentUserStore'
import { UserRepository } from '../../firebase/firestore/repositories/users/user-repository'

interface AppBarLayoutProps {}

const userRepo = new UserRepository()
const userJoinedTeamRepo = new UserJoinedTeamRepository()

const AppBarLayout: React.FC<AppBarLayoutProps> = ({}) => {
  const { uid, user } = useCurrentUserStore()
  const [openPopupType, setOpenPopupType] = React.useState<
    'join' | 'create' | null
  >(null)
  const [teams, setTeams] = useState<UserJoinedTeamRead[] | null>(null)

  useEffect(() => {
    const fetchTeams = async () => {
      if (!uid) return
      const teams = await userJoinedTeamRepo.getAll([uid])
      setTeams(teams)
    }
    fetchTeams()
  }, [uid])

  const onChangeTeam = async (id: string) => {
    if (!uid) return
    userRepo.update({ activeTeamId: id }, uid)
  }

  return (
    <AppBar sx={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left: Team selector */}
        <Box>
          <TeamDropdownMenu
            teams={teams ?? []}
            currentTeamId={user?.activeTeamId ?? null}
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
