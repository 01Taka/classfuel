import React from 'react'
import { Card, CardContent, Stack } from '@mui/material'
import { DAYS_TO_RECOVER_HP } from '../../../../constants/stats-constants'
import { useStatsMainStore } from '../../../../stores/user/statsMainStore'
import StreakHPDisplay from './StreakHPDisplay'
import StreakInfo from './StreakInfo'
import ExpGainedInfo from './ExpGainedInfo'
import { MINUTES_IN_MS } from '../../../../constants/datetime-constants'

const SessionResult: React.FC = () => {
  const { lastSessionStats } = useStatsMainStore()

  if (!lastSessionStats) return null

  const { newStats, details } = lastSessionStats

  return (
    <Card
      sx={{
        width: '80vw',
        height: '50vh',
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Stack alignItems="center">
          <StreakHPDisplay
            hp={newStats.streakHP}
            daysToRecover={
              DAYS_TO_RECOVER_HP - newStats.daysStudiedSinceLastHPUse
            }
          />
          <Stack spacing={2} alignItems="center" mr={3} mt={5}>
            <StreakInfo streak={newStats.streak} />
            <ExpGainedInfo
              expShort={details.expShortGained}
              expLong={Math.floor(details.expLongGained / (10 * MINUTES_IN_MS))}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default SessionResult
