import React from 'react'
import DateDisplay from '../atoms/DateDisplay'
import { Locale } from 'date-fns'

interface TodayDisplayProps {
  locale?: Locale
}

const TodayDisplay: React.FC<TodayDisplayProps> = ({ locale }) => {
  return (
    <div>
      <DateDisplay date={new Date()} locale={locale} />
    </div>
  )
}

export default TodayDisplay
