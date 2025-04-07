import React from 'react'
import { Chat } from '../../types/components/chat-types'
import useCurrentUser from '../../hooks/useCurrentUser'
import MessageBubble from '../molecules/MessageBubble'
import { Stack } from '@mui/material'
import { blue, purple } from '@mui/material/colors'

interface ChatWindowProps {}

const ChatWindow: React.FC<ChatWindowProps> = ({}) => {
  const { uid } = useCurrentUser()
  const chats: Chat[] = [
    {
      messageId: 1,
      senderId: 'npc-001',
      sentAt: 1712400000000,
      status: 'received',
      type: 'text',
      message: 'ねえ、今日の放課後って空いてる？',
    },
    {
      messageId: 2,
      senderId: uid ?? '',
      sentAt: 1712400050000,
      status: 'sent',
      type: 'text',
      message: 'うん、空いてるよ！',
    },
    {
      messageId: 3,
      senderId: 'npc-001',
      sentAt: 1712400100000,
      status: 'received',
      type: 'voice',
      voiceBase64:
        'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAESsA...', // 短縮
      message: 'ありがとう、じゃあ屋上で待ってるね♪',
    },
  ]

  return (
    <Stack>
      {chats.map((chat, index) => (
        <MessageBubble
          key={index}
          chat={chat}
          sx={
            chat.senderId === uid
              ? { ml: 'auto', bgcolor: blue[100] }
              : { mr: 'auto', bgcolor: purple[100] }
          }
        />
      ))}
    </Stack>
  )
}

export default ChatWindow
