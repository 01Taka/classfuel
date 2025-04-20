import React from 'react'
import BottomNavigationBar from '../organisms/BottomNavigationBar'
import { defaultNavItems } from '../../constants/nav-items'
import Ranking from '../../features/ranking/components/Ranking'

interface RankingPageProps {}

const RankingPage: React.FC<RankingPageProps> = ({}) => {
  return (
    <div>
      <Ranking />
      <BottomNavigationBar items={defaultNavItems} />
    </div>
  )
}

export default RankingPage
