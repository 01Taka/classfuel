import { Box, Container } from '@mui/material'
import React from 'react'
import LoginCard from '../../features/auth/components/LoginCard'
import { useGoogleLogin } from '../../features/auth/hooks/useGoogleLogin'

const LoginPage: React.FC = () => {
  const { handleLogin } = useGoogleLogin()

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <LoginCard onLogin={handleLogin} />
      </Box>
    </Container>
  )
}

export default LoginPage
