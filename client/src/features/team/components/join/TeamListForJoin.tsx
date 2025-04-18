import { QrCode } from '@mui/icons-material'
import { IconButton, Stack, Typography, Box } from '@mui/material'
import { TeamRead } from '../../../../types/firebase/firestore-documents/teams/team-document'

interface Props {
  teams: TeamRead[]
  onShowCode: (name: string, code: string) => void
}

const TeamListForJoin: React.FC<Props> = ({ teams, onShowCode }) => (
  <Stack>
    {/* Header row */}
    <Box
      display="flex"
      justifyContent="space-between"
      px={1}
      py={0.5}
      bgcolor="grey.100"
    >
      <Typography variant="body2" fontWeight="bold">
        チーム名
      </Typography>
      <Typography variant="body2" fontWeight="bold">
        参加コード
      </Typography>
    </Box>

    {/* Body rows */}
    {teams.map((team) => (
      <Box
        key={team.id}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={1}
        py={1}
        borderBottom="1px solid #ddd"
      >
        <Typography variant="body1">{team.name}</Typography>
        <IconButton
          onClick={() => onShowCode(team.name, team.codeId)}
          size="small"
        >
          <QrCode sx={{ width: 28, height: 28 }} />
        </IconButton>
      </Box>
    ))}
  </Stack>
)

export default TeamListForJoin
