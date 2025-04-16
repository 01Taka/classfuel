import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import Btn from '../../atoms/Btn'
import { ArrowDropDownIcon } from '@mui/x-date-pickers'
import { GroupAdd } from '@mui/icons-material'
import { UserJoinedTeamRead } from '../../../types/firebase/firestore-documents/users/user-joined-team-document'

interface TeamDropdownMenuProps {
  teams: UserJoinedTeamRead[]
  currentTeamId: string | null
  onChangeTeam: (id: string) => void
  onCreateTeam: () => void
  onJoinTeam: () => void
}

export const TeamDropdownMenu: React.FC<TeamDropdownMenuProps> = ({
  teams,
  currentTeamId,
  onChangeTeam,
  onCreateTeam,
  onJoinTeam,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => setAnchorEl(null)

  return (
    <>
      <Btn onClick={handleOpen} color="inherit">
        {teams.find((t) => t.docId === currentTeamId)?.name ?? 'チーム未選択'}
        <ArrowDropDownIcon />
      </Btn>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {teams.map((team) => (
          <MenuItem
            key={team.docId}
            selected={team.docId === currentTeamId}
            onClick={() => {
              onChangeTeam(team.docId)
              handleClose()
            }}
          >
            <ListItemIcon>
              <GroupIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{team.name}</ListItemText>
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => {
            onJoinTeam()
            handleClose()
          }}
        >
          <ListItemIcon>
            <GroupAdd fontSize="small" />
          </ListItemIcon>
          <ListItemText>チームに参加</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            onCreateTeam()
            handleClose()
          }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText>新しいチームを作成</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
