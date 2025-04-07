import React from 'react'
import ChatWindow from '../organisms/ChatWindow'
import ChoicePanel from '../organisms/ChoicePanel'
import { Stack } from '@mui/material'

interface ChatScreenLayoutProps {}

const ChatScreenLayout: React.FC<ChatScreenLayoutProps> = ({}) => {
  return (
    <Stack>
      <ChatWindow />
      <ChoicePanel />
    </Stack>
  )
}

export default ChatScreenLayout
