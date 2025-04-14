import React, { useEffect } from 'react'
import useFormState from '../../hooks/form/useFormState'
import { Stack, TextField } from '@mui/material'
import Btn from '../atoms/Btn'
import { TeamRepository } from '../../firebase/firestore/repositories/teams/team-repository'
import useAsyncHandler from '../../hooks/async-processing/useAsyncHandler'
import { UserRepository } from '../../firebase/firestore/repositories/users/user-repository'
import { UserRead } from '../../types/firebase/firestore-documents/users/user-document'
import { TeamMemberRepository } from '../../firebase/firestore/repositories/teams/team-member-repository'
import { useCurrentUserStore } from '../../stores/currentUserStore'
import useDailyReportService from '../../features/session/hooks/useDailyReportService'

interface CreateTeamProps {
  onSuccess?: () => void
}

interface FormState {
  name: string
}

const userRepo = new UserRepository()
const teamRepo = new TeamRepository()
const teamMemberRepo = new TeamMemberRepository()

const handleCreateTeam = async (
  user: UserRead,
  getTodayStudyTime: () => Promise<number>,
  teamName: string
) => {
  try {
    // チーム作成
    const result = await teamRepo.create({
      name: teamName,
      isIncrementMemberCount: true,
    })

    // ユーザーの参加チームIDを更新
    await userRepo.addParticipatingTeamIds(user.docId, result.id)

    // チームメンバー登録
    const todayStudyTime = await getTodayStudyTime()
    await teamMemberRepo.createWithId(
      { ...user, iconUrl: '', todayStudyTime },
      user.docId,
      [result.id]
    )
  } catch (error) {
    console.error('handleCreateTeam にてエラー:', error)
    throw new Error('チーム作成中にエラーが発生しました')
  }
}

const CreateTeam: React.FC<CreateTeamProps> = ({ onSuccess }) => {
  const { user } = useCurrentUserStore()
  const { getTodayReport } = useDailyReportService()

  const { formState, hasEmptyInput, createInputProps } =
    useFormState<FormState>({
      name: '',
    })

  const { asyncStatus, callAsyncFunction } = useAsyncHandler()

  const handleSubmit = () => {
    if (user) {
      const getTodayStudyTime = async () => {
        const report = await getTodayReport()
        return report?.studyTime || 0
      }

      callAsyncFunction(handleCreateTeam, [
        user,
        getTodayStudyTime,
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
