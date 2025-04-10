import React from 'react'
import TextWithLabel from '../atoms/TextWithLabel'
import {
  HOURS_IN_MILLISECOND,
  MINUTES_IN_MILLISECOND,
} from '../../constants/datetime-constants'
import ContainerCard from '../atoms/ContainerCard'
import { formatDuration } from '../../functions/dateTime-utils/time-format-utils'

interface TodayStudyPanelProps {}

const TodayStudyPanel: React.FC<TodayStudyPanelProps> = ({}) => {
  const todayStudy = 3 * HOURS_IN_MILLISECOND + 30 * MINUTES_IN_MILLISECOND // 例: 3時間30分
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
