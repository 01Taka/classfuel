import React, { useEffect, useState } from 'react'
import TextWithLabel from '../../../components/atoms/TextWithLabel'
import ContainerCard from '../../../components/atoms/ContainerCard'
import { formatDuration } from '../../../functions/dateTime-utils/time-format-utils'
import { useCurrentUserStore } from '../../../stores/user/currentUserStore'
import { getRanking } from '../services/ranking-services'
import { useUserReportStore } from '../../../stores/user/userReportStore'

interface TodayStudyPanelProps {}

const TodayStudyPanel: React.FC<TodayStudyPanelProps> = () => {
  const { user } = useCurrentUserStore()
  const { todayReport } = useUserReportStore()
  const [ranking, setRanking] = useState<number>(0)

  useEffect(() => {
    if (!user) return
    const fetchTodayReport = async () => {
      const todayStudyTime = todayReport?.studyTime ?? 0

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
        text={formatDuration(todayReport?.studyTime ?? 0, {
          units: { hours: '時間', minutes: '分' },
        })}
      />
      <TextWithLabel label="クラス順位" text={`${ranking}位`} />
    </ContainerCard>
  )
}

export default TodayStudyPanel
