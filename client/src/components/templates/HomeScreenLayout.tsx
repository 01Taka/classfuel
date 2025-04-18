import React from 'react'
import TodayDisplay from '../../features/home/components/TodayDisplay'
import StartPanel from '../../features/home/components/StartPanel'
import TodayStudyPanel from '../../features/home/components/TodayStudyPanel'
import { Stack } from '@mui/material'
import ActiveUserPanel from '../../features/home/components/ActiveUserPanel'
import AppBarLayout from '../../features/appBar/components/AppBarLayout'

interface HomeScreenLayoutProps {}

const HomeScreenLayout: React.FC<HomeScreenLayoutProps> = ({}) => {
  return (
    <>
      <AppBarLayout />
      <Stack spacing={3} mt={3}>
        <TodayDisplay />
        <TodayStudyPanel />
        <StartPanel />
        <ActiveUserPanel />
      </Stack>
    </>
  )
}

export default HomeScreenLayout
