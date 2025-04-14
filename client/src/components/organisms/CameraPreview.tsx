import React from 'react'

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}

const CameraPreview: React.FC<CameraPreviewProps> = ({
  videoRef,
  canvasRef,
}) => {
  return (
    <>
      <video ref={videoRef} style={{ width: '100%', borderRadius: 8 }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  )
}

export default CameraPreview
