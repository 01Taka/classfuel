import { Box, Stack } from '@mui/material'
import { blue, green, grey } from '@mui/material/colors'
import React from 'react'

interface MapBackGroundProps {}

const MapBackGround: React.FC<MapBackGroundProps> = ({}) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: grey[600],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack sx={{ width: '92%', height: '92%' }}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: blue[300],
          }}
        />
        <Box
          sx={{
            width: '100%',
            height: 160,
            bgcolor: green[500],
          }}
        />
      </Stack>
    </Box>
  )
}

export default MapBackGround
