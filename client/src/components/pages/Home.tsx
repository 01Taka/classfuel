import React from 'react'
import BottomNavigationBar from '../organisms/BottomNavigationBar'
import { defaultNavItems } from '../../constants/nav-items'

interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
  return (
    <div>
      <BottomNavigationBar items={defaultNavItems} />
    </div>
  )
}

export default Home
