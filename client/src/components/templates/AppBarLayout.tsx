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
import { handleJoinTeam } from '../../functions/services/team-services'
import { TeamRead } from '../../types/firebase/firestore-documents/teams/team-document'
import { TeamRepository } from '../../firebase/firestore/repositories/teams/team-repository'

interface AppBarLayoutProps {}

const userRepo = new UserRepository()
const userJoinedTeamRepo = new UserJoinedTeamRepository()
const teamRepo = new TeamRepository()

const AppBarLayout: React.FC<AppBarLayoutProps> = ({}) => {
  const { uid, user } = useCurrentUserStore()
  const [openPopupType, setOpenPopupType] = React.useState<
    'join' | 'create' | null
  >(null)
  const [userJoinedTeams, setUserJoinedTeams] = useState<
    UserJoinedTeamRead[] | null
  >(null)
  const [teams, setTeams] = useState<TeamRead[] | null>(null)

  useEffect(() => {
    const fetchUserJoinedTeams = async () => {
      if (!uid) return
      const userJoinedTeams = await userJoinedTeamRepo.getAll([uid])
      setUserJoinedTeams(userJoinedTeams)
    }
    fetchUserJoinedTeams()
  }, [uid])

  useEffect(() => {
    const fetchTeams = async () => {
      if (uid && userJoinedTeams) {
        const teamIds = userJoinedTeams.map((team) => team.docId)
        const fetchPromise = teamIds.map(
          async (teamId) => await teamRepo.read(teamId)
        )
        const teams = await Promise.all(fetchPromise)
        setTeams(teams.filter((team) => team !== null))
      }
    }
    fetchTeams()
  }, [userJoinedTeams])

  const onChangeTeam = async (id: string) => {
    if (!uid) return
    userRepo.update({ activeTeamId: id }, uid)
  }

  const extractTeamCode = (input: string): string => {
    try {
      const url = new URL(input)
      const match = url.pathname.match(/\/join-team\/([^/]+)/)
      return match ? match[1] : input
    } catch {
      // 入力がURLでなければそのままコードとして返す
      return input
    }
  }

  const isRogueFirestoreId = (id: string): boolean => {
    return /[\/\\.#$\[\]]/.test(id)
  }

  const onJoinTeam = (codeOrUrl: string) => {
    if (!user) return
    const code = extractTeamCode(codeOrUrl)
    if (isRogueFirestoreId(code) || code.length !== 20) {
      return
    }
    handleJoinTeam(user, 0, code)
  }

  return (
    <AppBar sx={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left: Team selector */}
        <Box>
          <TeamDropdownMenu
            teams={userJoinedTeams ?? []}
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
      <Popup
        onClose={() => setOpenPopupType(null)}
        sx={{ bgcolor: 'white' }}
        justifyContent="flex-start"
      >
        {openPopupType &&
          (openPopupType === 'join' ? (
            <JoinTeam
              teams={teams ?? []}
              onQrCodeScan={onJoinTeam}
              onTeamIdInput={onJoinTeam}
            />
          ) : (
            <CreateTeam onSuccess={() => setOpenPopupType(null)} />
          ))}
      </Popup>
    </AppBar>
  )
}

export default AppBarLayout
