import React, { useState } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  Paper,
} from '@mui/material'
import { UserRepository } from '../../../firebase/firestore/repositories/users/user-repository'
import { toTimestamp } from '../../../functions/dateTime-utils/time-conversion'
import { ISODate } from '../../../types/datetime-types'
import { Gender } from '../../../types/firebase/util-document-types'
import { useNavigate } from 'react-router-dom'
import { useCurrentUserStore } from '../../../stores/currentUserStore'

const nextPage = '/'

const UserSetup: React.FC = () => {
  const { uid } = useCurrentUserStore()
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [birthdate, setBirthdate] = useState<ISODate | ''>('')
  const [gender, setGender] = useState<Gender | ''>('')

  const handleSubmit = async () => {
    if (uid && nickname && birthdate && gender) {
      const userInfo = {
        displayName: nickname,
        birthdate: toTimestamp(birthdate),
        gender,
        session: null,
      }

      const repo = new UserRepository()
      await repo.createWithId(userInfo, uid)

      navigate(nextPage)
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
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: '100%' }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            ユーザー情報の設定
          </Typography>

          <Box display="flex" flexDirection="column" gap={3} mt={2}>
            <TextField
              label="ニックネーム"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              fullWidth
            />

            <TextField
              label="生年月日"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value as ISODate)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel id="gender-label">性別</InputLabel>
              <Select
                labelId="gender-label"
                value={gender}
                label="性別"
                onChange={(e: SelectChangeEvent) =>
                  setGender(e.target.value as Gender)
                }
              >
                <MenuItem value="male">男性</MenuItem>
                <MenuItem value="female">女性</MenuItem>
                <MenuItem value="other">その他</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ borderRadius: 3 }}
              fullWidth
            >
              保存して進む
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default UserSetup
