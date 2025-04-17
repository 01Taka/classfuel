import React, { useEffect } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
} from '@mui/material'
import { UserRepository } from '../../../firebase/firestore/repositories/users/user-repository'
import { toTimestamp } from '../../../functions/dateTime-utils/time-conversion'
import { ISODate } from '../../../types/datetime-types'
import { Gender } from '../../../types/firebase/util-document-types'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCurrentUserStore } from '../../../stores/currentUserStore'
import { UserWrite } from '../../../types/firebase/firestore-documents/users/user-document'
import useFormState from '../../../hooks/form/useFormState'
import { handleJoinTeam } from '../../../functions/services/team-services'

const nextPage = '/'
const userRepo = new UserRepository()

interface FormState {
  displayName: string
  birthdate: ISODate | ''
  gender: Gender | ''
}

const UserSetup: React.FC = () => {
  const { uid, user } = useCurrentUserStore()
  const [searchParams] = useSearchParams()
  const teamCode = searchParams.get('team-code')
  const navigate = useNavigate()
  const { formState, hasEmptyInput, createInputProps } =
    useFormState<FormState>({
      displayName: '',
      birthdate: '',
      gender: '',
    })

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user])

  const handleSubmit = async () => {
    if (uid && !hasEmptyInput) {
      const userInfo = {
        displayName: formState.displayName,
        birthdate: toTimestamp(formState.birthdate as ISODate),
        gender: formState.gender,
        session: null,
        activeTeamId: null,
      } as UserWrite

      await userRepo.createWithId(userInfo, uid)

      if (teamCode) {
        await handleJoinTeam(
          {
            docId: uid,
            displayName: formState.displayName,
            todayStudyTime: 0,
            session: null,
          },
          teamCode,
          true
        )
      }

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
              {...createInputProps('displayName')}
              fullWidth
            />

            <TextField
              label="生年月日"
              type="date"
              {...createInputProps('birthdate')}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel id="gender-label">性別</InputLabel>
              <Select
                labelId="gender-label"
                label="性別"
                {...createInputProps('gender')}
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
              disabled={hasEmptyInput}
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
