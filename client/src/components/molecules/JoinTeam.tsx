import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { QrCode2, Search } from '@mui/icons-material'
import Popup from './Popup'
import { useQrScanner } from '../../hooks/useQrScanner'
import CameraPreview from '../organisms/CameraPreview'
import IconButtonWithLabel from '../atoms/IconButtonWithLabel'

interface JoinTeamProps {
  onQrCodeScan?: () => void
  onTeamIdInput?: () => void
}

const JoinTeam: React.FC<JoinTeamProps> = ({ onQrCodeScan, onTeamIdInput }) => {
  const { scanning, canvasRef, videoRef, startScanning, stopScanning } =
    useQrScanner(onQrCodeScan)

  return (
    <div>
      <Typography variant="h6">自分が参加</Typography>
      <Stack direction="row" spacing={2} mb={2}>
        <IconButtonWithLabel label="QRコード読み取り" onClick={startScanning}>
          <QrCode2 fontSize="large" />
        </IconButtonWithLabel>
        <IconButtonWithLabel label="チームIDで参加" onClick={onTeamIdInput}>
          <Search fontSize="large" />
        </IconButtonWithLabel>
      </Stack>
      <Typography variant="h6">友達が参加</Typography>
      <Popup open={scanning} onClose={stopScanning} justifyContent="center">
        <Box sx={{ padding: 2, bgcolor: 'background.paper' }}>
          <CameraPreview canvasRef={canvasRef} videoRef={videoRef} />
          <Typography variant="h6" mt={2} mb={2} mx={'auto'} textAlign="center">
            QRコードを読み取ってください
          </Typography>
        </Box>
      </Popup>
    </div>
  )
}

export default JoinTeam
