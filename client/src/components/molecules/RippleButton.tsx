import React, { useState } from 'react'
import { Button, Box, SxProps, Theme } from '@mui/material'
import { styled } from '@mui/system'

type RippleButtonProps = {
  children: string
  sx?: SxProps<Theme> // MUIのsxプロパティ
  variant?: 'text' | 'contained' | 'outlined' // MUIのButton variant
  rippleColor?: string // 波紋の色（透明度含む）
  rippleDuration?: number // 波紋のアニメーション時間（ms）
  opacity?: { start?: number; end?: number }
  zIndex?: number
  onClickCallback?: () => void // 任意のクリック時の処理
  onFinishCallback?: () => void
}

const RippleContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  pointerEvents: 'none', // クリックを透過
  overflow: 'hidden',
})

const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  sx,
  variant = 'contained',
  rippleColor = 'rgba(0, 150, 255, 0.3)',
  rippleDuration = 600,
  opacity,
  zIndex = 9999,
  onClickCallback,
  onFinishCallback,
}) => {
  const [ripples, setRipples] = useState<
    { x: number; y: number; id: number }[]
  >([])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = event
    const newRipple = { x: clientX, y: clientY, id: Date.now() }
    setRipples((prev) => [...prev, newRipple])

    // アニメーション終了後にRippleを削除
    setTimeout(() => {
      onFinishCallback?.()
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
    }, rippleDuration)

    onClickCallback?.()
  }

  return (
    <>
      <Button variant={variant} sx={sx} onClick={handleClick}>
        {children}
      </Button>
      <RippleContainer zIndex={zIndex}>
        {ripples.map((ripple) => (
          <Box
            key={ripple.id}
            sx={{
              position: 'fixed',
              borderRadius: '50%',
              backgroundColor: rippleColor,
              left: ripple.x - 25,
              top: ripple.y - 25,
              width: 50,
              height: 50,
              transform: 'scale(0)',
              animation: `rippleEffect ${rippleDuration}ms ease-out`,
              '@keyframes rippleEffect': {
                '0%': { transform: 'scale(0)', opacity: opacity?.start ?? 1 },
                '100%': { transform: 'scale(50)', opacity: opacity?.end ?? 0 },
              },
            }}
          />
        ))}
      </RippleContainer>
    </>
  )
}

export default RippleButton
