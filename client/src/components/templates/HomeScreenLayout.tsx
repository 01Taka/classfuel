import React from 'react'
import TodayDisplay from '../molecules/TodayDisplay'
import StartPanel from '../organisms/StartPanel'
import TodayStudyPanel from '../organisms/TodayStudyPanel'
import { Stack } from '@mui/material'
import ActiveUserPanel from '../organisms/ActiveUserPanel'

interface HomeScreenLayoutProps {}

const HomeScreenLayout: React.FC<HomeScreenLayoutProps> = ({}) => {
  return (
    <Stack spacing={3}>
      <TodayDisplay />
      <TodayStudyPanel />
      <StartPanel />
      <ActiveUserPanel />
    </Stack>
  )
}

export default HomeScreenLayout
