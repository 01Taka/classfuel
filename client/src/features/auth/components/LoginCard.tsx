import { Paper, Typography, Button } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import React from 'react'

interface Props {
  onLogin: () => void
}

/**
 * ログインUIカード
 */
const LoginCard: React.FC<Props> = ({ onLogin }) => {
  return (
    <Paper
      elevation={3}
      sx={{ p: 4, borderRadius: 3, textAlign: 'center', width: '100%' }}
    >
      <Typography variant="h4" fontWeight="bold" mb={4}>
        ログイン
      </Typography>
      <Button
        variant="outlined"
        startIcon={<GoogleIcon />}
        onClick={onLogin}
        sx={{ borderRadius: 3 }}
        fullWidth
      >
        Googleでログイン
      </Button>
    </Paper>
  )
}

export default LoginCard
