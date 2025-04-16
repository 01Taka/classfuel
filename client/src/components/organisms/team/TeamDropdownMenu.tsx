import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import Btn from '../../atoms/Btn'
import { ArrowDropDownIcon } from '@mui/x-date-pickers'
import { GroupAdd } from '@mui/icons-material'

type Team = { id: string; name: string }

type Props = {
  teams: Team[]
  currentTeamId: string
  onChangeTeam: (id: string) => void
  onCreateTeam: () => void
  onJoinTeam: () => void
}

export const TeamDropdownMenu = ({
  teams,
  currentTeamId,
  onChangeTeam,
  onCreateTeam,
  onJoinTeam,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => setAnchorEl(null)

  return (
    <>
      <Btn onClick={handleOpen} color="inherit">
        {teams.find((t) => t.id === currentTeamId)?.name ?? 'チーム未選択'}
        <ArrowDropDownIcon />
      </Btn>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {teams.map((team) => (
          <MenuItem
            key={team.id}
            selected={team.id === currentTeamId}
            onClick={() => {
              onChangeTeam(team.id)
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
