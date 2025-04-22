import React from 'react'
import BottomNavigationBar from '../organisms/BottomNavigationBar'
import { defaultNavItems } from '../../constants/nav-items'
import HomeScreenLayout from '../templates/HomeScreenLayout'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  return (
    <div>
      <HomeScreenLayout />
      <BottomNavigationBar items={defaultNavItems} />
    </div>
  )
}

export default Home
