import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { QrCode2, Search } from '@mui/icons-material'
import { useQrScanner } from '../../../hooks/useQrScanner'
import IconButtonWithLabel from '../../atoms/IconButtonWithLabel'
import Popup from '../../molecules/Popup'
import CameraPreview from '../CameraPreview'

interface JoinTeamProps {
  onQrCodeScan?: (result: string) => void
  onTeamIdInput?: (code: string) => void
}

const JoinTeam: React.FC<JoinTeamProps> = ({ onQrCodeScan, onTeamIdInput }) => {
  const [openTeamCodeInput, setOpenTeamCodeInput] = useState(false)
  const [teamCode, setTeamCode] = useState('')
  const {
    scanning,
    scanned,
    canvasRef,
    videoRef,
    startScanning,
    stopScanning,
  } = useQrScanner(onQrCodeScan)

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">自分が参加</Typography>
      <Stack direction="row" spacing={2} mb={2}>
        <IconButtonWithLabel label="QRコード読み取り" onClick={startScanning}>
          <QrCode2 fontSize="large" />
        </IconButtonWithLabel>
        <IconButtonWithLabel
          label="チームIDで参加"
          onClick={() => setOpenTeamCodeInput(true)}
        >
          <Search fontSize="large" />
        </IconButtonWithLabel>
      </Stack>
      <Typography variant="h6">友達が参加</Typography>
      <Popup open={!scanned && scanning} onClose={stopScanning}>
        <Box sx={{ padding: 2, bgcolor: 'Background' }}>
          <CameraPreview canvasRef={canvasRef} videoRef={videoRef} />
          <Typography variant="h6" mt={2} mb={2} mx={'auto'} textAlign="center">
            QRコードを読み取ってください
          </Typography>
        </Box>
      </Popup>
      <Popup
        open={openTeamCodeInput}
        onClose={() => setOpenTeamCodeInput(false)}
      >
        <Stack sx={{ padding: 2, bgcolor: 'Background' }}>
          <TextField
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value)}
          />
          <Button
            disabled={!teamCode}
            onClick={() => {
              onTeamIdInput?.(teamCode)
              setOpenTeamCodeInput(false)
            }}
          >
            決定
          </Button>
        </Stack>
      </Popup>
    </Box>
  )
}

export default JoinTeam
