import { Box, CircularProgress, Typography } from '@mui/material'

const LoadingIndicator: React.FC = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    py={4}
  >
    <CircularProgress color="primary" />
    <Typography mt={2}>読み込み中...</Typography>
  </Box>
)

export default LoadingIndicator
