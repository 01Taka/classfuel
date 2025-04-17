import {
  Stack,
  Typography,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Snackbar,
} from '@mui/material'
import { QRCodeCanvas } from 'qrcode.react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useState } from 'react'

interface TeamJoinInfoCardProps {
  teamCode: string
  joinUrl: string
}

const TeamJoinInfoCard: React.FC<TeamJoinInfoCardProps> = ({
  teamCode,
  joinUrl,
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl)
      setCopied(true)
    } catch (err) {
      console.error('コピー失敗:', err)
    }
  }

  return (
    <>
      <Card sx={{ borderRadius: 3, p: 2, maxWidth: 360, mx: 'auto', mt: 3 }}>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <QRCodeCanvas value={joinUrl} size={128} level="H" />
            <Typography variant="subtitle1" fontWeight="bold">
              チームコード: {teamCode}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                参加用リンク: {joinUrl}
              </Typography>
              <Tooltip title="URLをコピー">
                <IconButton onClick={handleCopy} size="small">
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="URLをコピーしました"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  )
}

export default TeamJoinInfoCard
