import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { QrCode, QrCode2, Search } from '@mui/icons-material'
import { useQrScanner } from '../../../hooks/useQrScanner'
import IconButtonWithLabel from '../../atoms/IconButtonWithLabel'
import Popup from '../../molecules/Popup'
import CameraPreview from '../CameraPreview'
import { TeamRead } from '../../../types/firebase/firestore-documents/teams/team-document'
import TeamJoinInfoCard from '../../../features/team/TeamJoinInfoCard'

interface JoinTeamProps {
  teams: TeamRead[]
  onQrCodeScan?: (result: string) => void
  onTeamIdInput?: (code: string) => void
}

const JoinTeam: React.FC<JoinTeamProps> = ({
  teams,
  onQrCodeScan,
  onTeamIdInput,
}) => {
  const [openTeamCodeInput, setOpenTeamCodeInput] = useState(false)
  const [openTeamCodeInfo, setOpenTeamCodeInfo] = useState<{
    name: string
    code: string
    url: string
  } | null>(null)
  const [teamCode, setTeamCode] = useState('')
  const {
    scanning,
    scanned,
    canvasRef,
    videoRef,
    startScanning,
    stopScanning,
  } = useQrScanner(onQrCodeScan)

  const getJoinPageUrl = (teamCode: string) => {
    return `http://localhost:5173/join-team/${teamCode}`
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">自分が参加</Typography>
      <Stack direction="row" spacing={2} mb={2}>
        <IconButtonWithLabel label="QRコード読み取り" onClick={startScanning}>
          <QrCode2 fontSize="large" />
        </IconButtonWithLabel>
        <IconButtonWithLabel
          label="チームコードで参加"
          onClick={() => setOpenTeamCodeInput(true)}
        >
          <Search fontSize="large" />
        </IconButtonWithLabel>
      </Stack>
      <Stack>
        <Typography variant="h6">友達が参加</Typography>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Typography>チーム名</Typography>
          <Typography>参加コード</Typography>
        </Stack>
        {teams.map((team) => (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            <Typography mr={2}>{team.name}</Typography>
            <IconButton
              onClick={() =>
                setOpenTeamCodeInfo({
                  name: team.name,
                  code: team.codeId,
                  url: getJoinPageUrl(team.codeId),
                })
              }
              sx={{ pr: 3 }}
            >
              <QrCode sx={{ width: 36, height: 36 }} />
            </IconButton>
          </Stack>
        ))}
      </Stack>
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
      <Popup onClose={() => setOpenTeamCodeInfo(null)}>
        {openTeamCodeInfo && (
          <TeamJoinInfoCard
            teamName={openTeamCodeInfo.name}
            teamCode={openTeamCodeInfo.code}
            joinUrl={openTeamCodeInfo.url}
          />
        )}
      </Popup>
    </Box>
  )
}

export default JoinTeam
