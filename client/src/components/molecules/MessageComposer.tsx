import React, { useState } from 'react'
import { TextField, Button, Box } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

interface MessageComposerProps {
  rows?: number
  placeholder?: string
  onSendText: (message: string) => void
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  rows = 1,
  placeholder = 'メッセージを入力...',
  onSendText,
}) => {
  const [text, setText] = useState('')

  // テキスト送信
  const handleTextSend = () => {
    if (text.trim()) {
      onSendText(text)
      setText('') // 送信後クリア
    }
  }

  return (
    <Box
      p={2}
      borderTop={1}
      borderColor="grey.300"
      display="flex"
      flexDirection="column"
      gap={2}
    >
      {/* テキスト入力 */}
      <TextField
        variant="outlined"
        placeholder={placeholder}
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
        multiline
        rows={rows}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleTextSend}
        disabled={!text.trim()}
        startIcon={<SendIcon />}
      >
        送信
      </Button>
    </Box>
  )
}

export default MessageComposer
