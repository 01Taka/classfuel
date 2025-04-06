import React from 'react'
import BottomNavigationBar from '../organisms/BottomNavigationBar'
import { defaultNavItems } from '../../constants/nav-items'

interface ChatProps {}

const Chat: React.FC<ChatProps> = ({}) => {
  return (
    <div>
      <h1>ChatContent</h1>
      <BottomNavigationBar items={defaultNavItems} />
    </div>
  )
}

export default Chat
