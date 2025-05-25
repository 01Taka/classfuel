import React from 'react'
import { Typography, Box, Stack, Paper } from '@mui/material'
import { EmojiEvents, AccessTime } from '@mui/icons-material'
import { blue, yellow, grey } from '@mui/material/colors'
import { formatDuration } from '../../../../functions/dateTime-utils/time-format-utils'

interface MapStateTextProps {
  todayStudyTimeMs: number
  advanceNumber: number
}

const MapStateText: React.FC<MapStateTextProps> = ({
  todayStudyTimeMs,
  advanceNumber,
}) => {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        bgcolor: blue[50],
        borderRadius: 3,
        border: `2px solid ${blue[300]}`,
        boxShadow: `0px 4px 10px ${blue[100]}`,
        width: '100%',
        maxWidth: 400,
        textAlign: 'center',
      }}
    >
      <Stack spacing={1} alignItems="center">
        <Box display="flex" alignItems="center" gap={1}>
          <EmojiEvents sx={{ color: yellow[700] }} />
          <Typography variant="h6" color={blue[800]}>
            今日の進行: <strong>{advanceNumber}マス</strong>
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <AccessTime sx={{ color: grey[700] }} />
          <Typography variant="body1" color="textSecondary">
            学習時間:{' '}
            <strong>
              {formatDuration(todayStudyTimeMs, {
                units: { hours: '時間', minutes: '分' },
              })}
            </strong>
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )
}

export default MapStateText
