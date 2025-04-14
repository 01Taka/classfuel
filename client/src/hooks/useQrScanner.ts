import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'

export const useQrScanner = (onScanned?: (result: string) => void) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scanned, setScanned] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    if (!scanning) return

    let stream: MediaStream
    let interval: NodeJS.Timeout

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }

        interval = setInterval(() => {
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
            onScanned?.(code.data)
            stopCamera()
          }
        }, 500)
      } catch (err) {
        console.error('カメラの起動に失敗しました', err)
      }
    }

    const stopCamera = () => {
      stream?.getTracks().forEach((track) => track.stop())
      if (videoRef.current) videoRef.current.srcObject = null
      clearInterval(interval)
    }

    startCamera()

    return () => {
      stopCamera()
    }
  }, [scanning])

  const startScanning = () => {
    setScanned(null)
    setScanning(true)
  }

  const stopScanning = () => {
    setScanning(false)
  }

  return {
    videoRef,
    canvasRef,
    scanned,
    scanning,
    startScanning,
    stopScanning,
  }
}
