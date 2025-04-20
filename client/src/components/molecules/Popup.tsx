import { IconButton, Modal, Stack, SxProps } from '@mui/material'
import { FC, ReactNode } from 'react'
import CloseIcon from '@mui/icons-material/Close'

interface PopupProps {
  open?: boolean
  children: ReactNode
  height?: string | number
  sx?: SxProps // Box用のスタイル
  modalSx?: SxProps // Modal用のスタイル
  absoluteCloseButton?: boolean
  stackDirection?: 'row' | 'column'
  justifyContent?:
    | 'start'
    | 'end'
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  alignItems?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  spacing?: number
  onClose?: (state: false) => void
}

const Popup: FC<PopupProps> = ({
  open,
  children,
  height = '100%',
  sx,
  modalSx,
  absoluteCloseButton = false,
  stackDirection = 'column',
  justifyContent = 'center',
  alignItems = 'center',
  spacing,
  onClose,
}) => {
  const stackStyles: SxProps = {
    position: 'relative',
    width: '100%',
    maxWidth: '95vw',
    height,
    maxHeight: '95vh',
    overflow: 'auto',
    borderRadius: 2,
    ...sx,
  }

  return (
    <Modal
      open={open === true || (open === undefined && (!!children || !onClose))}
      onClose={onClose}
      aria-labelledby="popup-title"
      aria-describedby="popup-description"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        ...modalSx,
      }}
    >
      <Stack
        id="popup-description"
        direction={stackDirection}
        justifyContent={justifyContent}
        alignItems={alignItems}
        spacing={spacing}
        sx={stackStyles}
      >
        {children}
        {onClose && (
          <IconButton
            onClick={() => onClose(false)}
            size="large"
            color="warning"
            sx={{
              position: absoluteCloseButton ? 'absolute' : 'fixed',
              top: 18,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Stack>
    </Modal>
  )
}

export default Popup
