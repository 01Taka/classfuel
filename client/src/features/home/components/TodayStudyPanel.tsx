import React, { useEffect, useState } from 'react'
import TextWithLabel from '../../../components/atoms/TextWithLabel'
import ContainerCard from '../../../components/atoms/ContainerCard'
import { formatDuration } from '../../../functions/dateTime-utils/time-format-utils'
import { useCurrentUserStore } from '../../../stores/user/currentUserStore'
import useDailyReportService from '../../session/hooks/useDailyReportService'
import { getRanking } from '../services/ranking-services'

interface TodayStudyPanelProps {}

const TodayStudyPanel: React.FC<TodayStudyPanelProps> = () => {
  const { user } = useCurrentUserStore()
  const { getTodayReport } = useDailyReportService()
  const [todayStudy, setTodayStudy] = useState<number>(0)
  const [ranking, setRanking] = useState<number>(0)

  useEffect(() => {
    if (!user) return
    const fetchTodayReport = async () => {
      const todayReport = await getTodayReport()
      const todayStudyTime = todayReport?.studyTime || 0
      setTodayStudy(todayStudyTime)

      if (user.activeTeamId) {
        const ranking = await getRanking(user.activeTeamId, todayStudyTime)
        setRanking(ranking)
      }
    }

    fetchTodayReport()
  }, [user])

  return (
    <ContainerCard contentSx={{ flexDirection: 'row' }}>
      <TextWithLabel
        label="今日の合計"
        text={formatDuration(todayStudy, {
          units: { hours: '時間', minutes: '分' },
        })}
      />
      <TextWithLabel label="クラス順位" text={`${ranking}位`} />
    </ContainerCard>
  )
}

export default TodayStudyPanel
