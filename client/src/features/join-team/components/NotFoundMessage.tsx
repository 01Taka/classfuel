import { Box, Typography } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

interface NotFoundMessageProps {
  code: string
}

const NotFoundMessage: React.FC<NotFoundMessageProps> = ({ code }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    py={4}
    color="error.main"
  >
    <ErrorOutlineIcon fontSize="large" />
    <Typography variant="h6" mt={1}>
      チームが見つかりませんでした
    </Typography>
    <Typography variant="body2" color="textSecondary">
      招待コードを確認してください
    </Typography>
    <Typography variant="body2" color="textSecondary">
      コード: {code || '未入力'}
    </Typography>
  </Box>
)

export default NotFoundMessage
