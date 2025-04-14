import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { Box, Typography, Button } from '@mui/material'

export const QrScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scanned, setScanned] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    if (!scanning) return

    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    }

    const scan = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, canvas.width, canvas.height)
      if (code) {
        setScanned(code.data)
        stopCamera()
      }
    }

    const interval = setInterval(scan, 500)
    startCamera()

    return () => {
      clearInterval(interval)
      stopCamera()
    }
  }, [scanning])

  const stopCamera = () => {
    const video = videoRef.current
    const stream = video?.srcObject as MediaStream
    stream?.getTracks().forEach((track) => track.stop())
    if (video) video.srcObject = null
  }

  const resetScanner = () => {
    setScanned(null)
    setScanning(true)
  }

  return (
    <Box>
      {scanned ? (
        <>
          <Typography variant="h6" gutterBottom>
            読み取り結果:
          </Typography>
          <Typography variant="body1" color="primary">
            {scanned}
          </Typography>
          <Button variant="contained" onClick={resetScanner}>
            再スキャン
          </Button>
        </>
      ) : (
        <>
          <video ref={videoRef} style={{ width: '100%', borderRadius: 8 }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {!scanning && (
            <Button variant="contained" onClick={() => setScanning(true)}>
              スキャン開始
            </Button>
          )}
        </>
      )}
    </Box>
  )
}
