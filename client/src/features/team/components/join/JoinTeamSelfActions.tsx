import { Stack } from '@mui/material'
import { QrCode2, Search } from '@mui/icons-material'
import IconButtonWithLabel from '../../../../components/atoms/IconButtonWithLabel'

interface JoinTeamSelfActionsProps {
  onScanClick: () => void
  onInputClick: () => void
}

const JoinTeamSelfActions: React.FC<JoinTeamSelfActionsProps> = ({
  onScanClick,
  onInputClick,
}) => (
  <Stack direction="row" spacing={2} mb={2}>
    <IconButtonWithLabel label="QRコード読み取り" onClick={onScanClick}>
      <QrCode2 fontSize="large" />
    </IconButtonWithLabel>
    <IconButtonWithLabel label="チームコードで参加" onClick={onInputClick}>
      <Search fontSize="large" />
    </IconButtonWithLabel>
  </Stack>
)

export default JoinTeamSelfActions
