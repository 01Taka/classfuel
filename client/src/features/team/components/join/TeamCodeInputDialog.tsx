import { Stack, TextField, Button } from '@mui/material'
import Popup from '../../../../components/molecules/Popup'

interface Props {
  open: boolean
  onClose: () => void
  teamCode: string
  onChange: (v: string) => void
  onSubmit: () => void
}

const TeamCodeInputDialog: React.FC<Props> = ({
  open,
  onClose,
  teamCode,
  onChange,
  onSubmit,
}) => (
  <Popup open={open} onClose={onClose}>
    <Stack sx={{ padding: 2, bgcolor: 'Background' }}>
      <TextField value={teamCode} onChange={(e) => onChange(e.target.value)} />
      <Button disabled={!teamCode} onClick={onSubmit}>
        決定
      </Button>
    </Stack>
  </Popup>
)

export default TeamCodeInputDialog
