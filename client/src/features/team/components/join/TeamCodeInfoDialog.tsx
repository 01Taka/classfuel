import Popup from '../../../../components/molecules/Popup'
import TeamCodeInfoCard from './TeamCodeInfoCard'

interface TeamCodeInfoDialogProps {
  openInfo: { name: string; code: string; url: string } | null
  onClose: () => void
}

const TeamCodeInfoDialog: React.FC<TeamCodeInfoDialogProps> = ({
  openInfo,
  onClose,
}) => (
  <Popup open={!!openInfo} onClose={onClose}>
    {openInfo && (
      <TeamCodeInfoCard
        teamName={openInfo.name}
        teamCode={openInfo.code}
        joinUrl={openInfo.url}
      />
    )}
  </Popup>
)

export default TeamCodeInfoDialog
