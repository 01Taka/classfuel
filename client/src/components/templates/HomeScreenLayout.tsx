import React from 'react'
import TodayDisplay from '../molecules/TodayDisplay'
import StartPanel from '../organisms/StartPanel'
import TodayStudyPanel from '../organisms/TodayStudyPanel'
import { Stack } from '@mui/material'
import ActiveUserPanel from '../organisms/ActiveUserPanel'
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
