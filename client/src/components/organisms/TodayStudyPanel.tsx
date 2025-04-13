import React, { useEffect } from 'react'
import TextWithLabel from '../atoms/TextWithLabel'
import ContainerCard from '../atoms/ContainerCard'
import { formatDuration } from '../../functions/dateTime-utils/time-format-utils'
import { useCurrentUserStore } from '../../stores/currentUserStore'
import useDailyReportService from '../../features/session/hooks/useDailyReportService'

interface TodayStudyPanelProps {}

const TodayStudyPanel: React.FC<TodayStudyPanelProps> = ({}) => {
  const { user } = useCurrentUserStore()
  const { getTodayReport } = useDailyReportService()
  const [todayStudy, setTodayStudy] = React.useState<number>(0)

  useEffect(() => {
    if (!user) return
    const fetchTodayReport = async () => {
      const todayReport = await getTodayReport()
      setTodayStudy(todayReport?.studyTime || 0)
    }
    fetchTodayReport()
  }, [user])

  const ranking = 5 // 例: 5位

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
