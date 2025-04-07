interface BaseChat {
  messageId?: number
  senderId: string
  sentAt: number
  status: 'sent' | 'received' | 'read'
}

export interface TextMessage {
  type: 'text'
  message: string
}

export interface VoiceMessage {
  type: 'voice'
  voiceBase64: string
  message?: string
}

export type TextChat = TextMessage & BaseChat

export type VoiceChat = VoiceMessage & BaseChat

export type Message = TextMessage | VoiceMessage

export type Chat = TextChat | VoiceChat
