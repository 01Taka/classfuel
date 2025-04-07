import React from 'react'
import BottomNavigationBar from '../organisms/BottomNavigationBar'
import { defaultNavItems } from '../../constants/nav-items'
import ChatScreenLayout from '../templates/ChatScreenLayout'

interface ChatProps {}

const Chat: React.FC<ChatProps> = ({}) => {
  return (
    <div>
      <ChatScreenLayout />
      <BottomNavigationBar items={defaultNavItems} />
    </div>
  )
}

export default Chat
