import React from 'react'
import QuickstartButton from './QuickstartButton'
import { Stack, Typography } from '@mui/material'
import { blue, deepPurple, red, yellow } from '@mui/material/colors'
import { FlashOn, Balance, Flag } from '@mui/icons-material'

interface QuickstartProps {
  onQuickstartClick?: (timeMinutes: number) => void
}

const iconSize = 40
const quickstartConfigs = [
  {
    time: 10,
    icon: <FlashOn sx={{ color: yellow[800], fontSize: iconSize }} />,
    labelColor: blue[300],
  },
  {
    time: 25,
    icon: <Balance sx={{ color: deepPurple[500], fontSize: iconSize }} />,
    labelColor: blue[300],
  },
  {
    time: 60,
    icon: <Flag sx={{ color: red['A700'], fontSize: iconSize }} />,
    labelColor: blue[300],
  },
]

const Quickstart: React.FC<QuickstartProps> = ({ onQuickstartClick }) => {
  return (
    <Stack
      bgcolor={blue[100]}
      padding={1}
      spacing={1}
      alignItems="center"
      borderRadius={2}
      boxShadow={2}
    >
      <Typography variant="h5">QuickStart</Typography>

      <Stack direction="row" spacing={2} justifyContent="center" pb={1}>
        {quickstartConfigs.map(({ time, icon, labelColor }) => (
          <Stack key={time} spacing={1} alignItems="center">
            {icon}
            <QuickstartButton
              timeMinutes={time}
              buttonSize={110}
              buttonColor={labelColor}
              cellSize={10}
              cellGap={0.1}
              cellColor={blue[800]}
              onClick={() => {
                if (typeof onQuickstartClick === 'function') {
                  onQuickstartClick(time)
                }
              }}
            />
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}

export default Quickstart
