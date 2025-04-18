import { Box } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

export const UserActions: React.FC = () => (
  <Box display="flex" gap={2} alignItems="center">
    <NotificationsIcon />
    <AccountCircleIcon />
  </Box>
)
