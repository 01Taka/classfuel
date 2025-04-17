import { Box, Card, CardContent, Typography, Button } from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import { TeamRead } from '../../../types/firebase/firestore-documents/teams/team-document'

interface TeamPreviewProps {
  team: TeamRead
  isParticipated: boolean
  onJoinTeam: () => void
}

const TeamPreview: React.FC<TeamPreviewProps> = ({
  team,
  isParticipated,
  onJoinTeam,
}) => (
  <Card sx={{ borderRadius: 3, p: 2, boxShadow: 3 }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <GroupIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h5">{team.name}</Typography>
      </Box>

      <Typography variant="body1" gutterBottom>
        {team.description || 'チームの説明はまだありません。'}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={isParticipated}
        onClick={onJoinTeam}
      >
        {isParticipated ? '既に参加しているチームです' : 'このチームに参加する'}
      </Button>
    </CardContent>
  </Card>
)

export default TeamPreview
