import { Stack, Typography } from '@mui/material'
import React from 'react'
import { QrCode2, Search } from '@mui/icons-material'
import IconButtonWithLabel from '../atoms/IconButtonWIthLabel'

interface JoinTeamProps {
  onQrCodeScan?: () => void
  onTeamIdInput?: () => void
}

const JoinTeam: React.FC<JoinTeamProps> = ({ onQrCodeScan, onTeamIdInput }) => {
  return (
    <div>
      <Typography variant="h6">自分が参加</Typography>
      <Stack direction="row" spacing={2} mb={2}>
        <IconButtonWithLabel label="QRコード読み取り" onClick={onQrCodeScan}>
          <QrCode2 fontSize="large" />
        </IconButtonWithLabel>
        <IconButtonWithLabel label="チームIDで参加" onClick={onTeamIdInput}>
          <Search fontSize="large" />
        </IconButtonWithLabel>
      </Stack>
      <Typography variant="h6">友達が参加</Typography>
    </div>
  )
}

export default JoinTeam
