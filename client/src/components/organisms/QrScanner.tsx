import React from 'react'
import { Box, Button, Stack } from '@mui/material'
import { useQrScanner } from '../../hooks/useQrScanner'

interface QrScannerProps {
  hideAfterScan?: boolean
  onScanned: (result: string) => void
}

const QrScanner: React.FC<QrScannerProps> = ({ hideAfterScan, onScanned }) => {
  const {
    videoRef,
    canvasRef,
    scanned,
    scanning,
    startScanning,
    stopScanning,
  } = useQrScanner(onScanned)

  return (
    <Box>
      {(!scanned || !hideAfterScan) && (
        <>
          <video ref={videoRef} style={{ width: '100%', borderRadius: 8 }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {!scanning ? (
            <Button variant="contained" onClick={startScanning}>
              スキャン開始
            </Button>
          ) : (
            <Stack direction="row" spacing={2} mt={2}>
              <Button variant="contained" color="error" onClick={stopScanning}>
                キャンセル
              </Button>
            </Stack>
          )}
        </>
      )}
    </Box>
  )
}

export default QrScanner
