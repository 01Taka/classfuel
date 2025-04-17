import React, { useEffect } from 'react'
import useFormState from '../../../hooks/form/useFormState'
import { Stack, TextField } from '@mui/material'
import Btn from '../../atoms/Btn'
import useAsyncHandler from '../../../hooks/async-processing/useAsyncHandler'
import { useCurrentUserStore } from '../../../stores/currentUserStore'
import useDailyReportService from '../../../features/session/hooks/useDailyReportService'
import { handleCreateTeam } from '../../../functions/services/team-services'

interface CreateTeamProps {
  onSuccess?: () => void
}

interface FormState {
  name: string
}

const CreateTeam: React.FC<CreateTeamProps> = ({ onSuccess }) => {
  const { user } = useCurrentUserStore()
  const { getTodayReport } = useDailyReportService()

  const { formState, hasEmptyInput, createInputProps } =
    useFormState<FormState>({
      name: '',
    })

  const { asyncStatus, callAsyncFunction } = useAsyncHandler()

  const handleSubmit = async () => {
    if (user) {
      const report = await getTodayReport()

      const todayStudyTime = report?.studyTime || 0

      callAsyncFunction(handleCreateTeam, [
        user,
        todayStudyTime,
        formState.name,
      ])
    }
  }

  useEffect(() => {
    if (asyncStatus === 'success') {
      onSuccess?.()
    }
  }, [asyncStatus])

  return (
    <Stack alignItems="center" spacing={5} sx={{ padding: 2, mt: 10 }}>
      <TextField
        {...createInputProps('name')}
        label="チーム名"
        variant="outlined"
      />
      <Btn
        variant="contained"
        disabled={!!user && hasEmptyInput}
        onClick={handleSubmit}
      >
        チームを作成
      </Btn>
    </Stack>
  )
}

export default CreateTeam
