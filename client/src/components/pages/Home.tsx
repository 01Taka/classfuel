import React from 'react'
import BottomNavigationBar from '../organisms/BottomNavigationBar'
import { defaultNavItems } from '../../constants/nav-items'
import HomeScreenLayout from '../templates/HomeScreenLayout'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <>
      <HomeScreenLayout />
      <BottomNavigationBar items={defaultNavItems} />
    </>
  )
}

export default Home
