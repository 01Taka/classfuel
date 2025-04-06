import React from 'react'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { Button, Container, Typography, Box, Paper } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../../firebase/firebase'

const nextPage = '/user-setup'

const Login: React.FC = () => {
  const provider = new GoogleAuthProvider()
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider)
      navigate(nextPage)
    } catch (error) {
      console.error('ログインエラー:', error)
      alert('ログインに失敗しました')
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
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
            onClick={handleLogin}
            sx={{ borderRadius: 3 }}
            fullWidth
          >
            Googleでログイン
          </Button>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login
