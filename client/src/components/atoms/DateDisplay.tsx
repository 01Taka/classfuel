import { format } from 'date-fns'
import { ja, Locale } from 'date-fns/locale'
import React from 'react'

interface DateDisplayProps {
  date: Date
  locale?: Locale
}

const DateDisplay: React.FC<DateDisplayProps> = ({ date, locale = ja }) => {
  const formatted = format(date, 'M月d日 (E)', { locale })
  return <>{formatted}</>
}

export default DateDisplay
