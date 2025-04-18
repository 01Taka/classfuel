import { Stack, Typography } from '@mui/material'
import React from 'react'
import JoinTeamSelfActions from './join/JoinTeamSelfActions'
import QrScannerDialog from './join/QrScannerDialog'
import TeamCodeInfoDialog from './join/TeamCodeInfoDialog'
import TeamCodeInputDialog from './join/TeamCodeInputDialog'
import { useJoinTeamDialog } from '../hooks/useJoinTeamDialog'
import { useQrScanner } from '../../../hooks/useQrScanner'
import { TeamRead } from '../../../types/firebase/firestore-documents/teams/team-document'
import TeamListForJoin from './join/TeamListForJoin'

interface JoinTeamLayoutProps {
  teams: TeamRead[]
  onQrCodeScan?: (result: string) => void
  onTeamIdInput?: (code: string) => void
}

const JoinTeamLayout: React.FC<JoinTeamLayoutProps> = ({
  teams,
  onQrCodeScan,
  onTeamIdInput,
}) => {
  const {
    teamCode,
    setTeamCode,
    openInput,
    setOpenInput,
    openInfo,
    setOpenInfo,
    openTeamCodeInfo,
  } = useJoinTeamDialog()

  const {
    scanning,
    scanned,
    canvasRef,
    videoRef,
    startScanning,
    stopScanning,
  } = useQrScanner(onQrCodeScan)

  return (
    <>
      <Stack padding={2} spacing={1}>
        <Typography variant="h6" pt={3}>
          自分が参加
        </Typography>
        <JoinTeamSelfActions
          onScanClick={startScanning}
          onInputClick={() => setOpenInput(true)}
        />

        <Typography variant="h6" pt={5}>
          友達が参加
        </Typography>
        <TeamListForJoin teams={teams} onShowCode={openTeamCodeInfo} />
      </Stack>

      <QrScannerDialog
        open={!scanned && scanning}
        onClose={stopScanning}
        canvasRef={canvasRef}
        videoRef={videoRef}
      />

      <TeamCodeInputDialog
        open={openInput}
        onClose={() => setOpenInput(false)}
        teamCode={teamCode}
        onChange={setTeamCode}
        onSubmit={() => {
          onTeamIdInput?.(teamCode)
          setOpenInput(false)
        }}
      />

      <TeamCodeInfoDialog
        openInfo={openInfo}
        onClose={() => setOpenInfo(null)}
      />
    </>
  )
}

export default JoinTeamLayout
