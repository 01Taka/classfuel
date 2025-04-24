import React from 'react'
import TodayDisplay from '../../features/home/components/TodayDisplay'
import StartPanel from '../../features/home/components/StartPanel'
import TodayStudyPanel from '../../features/home/components/TodayStudyPanel'
import { Stack } from '@mui/material'
import ActiveUserPanel from '../../features/home/components/ActiveUserPanel'
import AppBarLayout from '../../features/appBar/components/AppBarLayout'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Popup from '../molecules/Popup'
import SessionResult from '../../features/session/components/stats/SessionResult'

interface HomeScreenLayoutProps {}

const HomeScreenLayout: React.FC<HomeScreenLayoutProps> = ({}) => {
  const navigate = useNavigate()
  const [searchPrams, _setSearchPrams] = useSearchParams()

  return (
    <>
      <AppBarLayout />
      <Stack spacing={3} mt={3}>
        <TodayDisplay />
        <TodayStudyPanel />
        <StartPanel />
        <ActiveUserPanel />
      </Stack>
      <Popup
        open={searchPrams.get('modal') === 'result'}
        onClose={() => navigate('/')}
      >
        <SessionResult />
      </Popup>
    </>
  )
}

export default HomeScreenLayout
