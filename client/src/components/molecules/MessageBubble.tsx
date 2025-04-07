import React from 'react'
import { Card, CardContent, Typography, SxProps } from '@mui/material'
import { Chat } from '../../types/components/chat-types'
import VoicePlayer from './VoicePlayer'

interface MessageBubbleProps {
  chat: Chat
  color?: string
  sx?: SxProps
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ chat, color, sx }) => {
  return (
    <Card
      sx={{
        maxWidth: '60%',
        p: 1,
        m: 1,
        backgroundColor: chat.senderId === 'self' ? '#DCF8C6' : '#FFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color,
        ...sx,
      }}
    >
      <CardContent sx={{ width: '100%', textAlign: 'center' }}>
        {chat.message && <Typography>{chat.message}</Typography>}
        {chat.type === 'voice' && (
          <VoicePlayer voiceBase64={chat.voiceBase64} />
        )}
      </CardContent>
    </Card>
  )
}

export default MessageBubble
