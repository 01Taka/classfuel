import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography, Paper } from '@mui/material'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      px={2}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          borderRadius: 4,
          textAlign: 'center',
          maxWidth: 400,
          width: '100%',
          bgcolor: 'background.paper',
        }}
      >
        <SentimentVeryDissatisfiedIcon
          color="primary"
          sx={{ fontSize: 60, mb: 2 }}
        />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          404 - Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          お探しのページが見つかりませんでした。
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3, borderRadius: 3 }}
          onClick={() => navigate('/')}
        >
          ホームに戻る
        </Button>
      </Paper>
    </Box>
  )
}

export default NotFound
