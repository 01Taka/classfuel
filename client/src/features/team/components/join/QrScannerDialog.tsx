import { Box, Typography } from '@mui/material'
import Popup from '../../../../components/molecules/Popup'
import CameraPreview from '../../../../components/organisms/CameraPreview'
import { RefObject } from 'react'

interface QrScannerDialogProps {
  open: boolean
  onClose: () => void
  canvasRef: RefObject<HTMLCanvasElement | null>
  videoRef: RefObject<HTMLVideoElement | null>
}

const QrScannerDialog: React.FC<QrScannerDialogProps> = ({
  open,
  onClose,
  canvasRef,
  videoRef,
}) => (
  <Popup open={open} onClose={onClose}>
    <Box sx={{ p: 2, bgcolor: 'Background' }}>
      <CameraPreview canvasRef={canvasRef} videoRef={videoRef} />
      <Typography variant="h6" mt={2} textAlign="center">
        QRコードを読み取ってください
      </Typography>
    </Box>
  </Popup>
)

export default QrScannerDialog
