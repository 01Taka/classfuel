import { useEffect } from 'react'
import { handleCreateTeam } from '../../join-team/services/team-services'
import useAsyncHandler from '../../../hooks/async-processing/useAsyncHandler'
import { useCurrentUserStore } from '../../../stores/user/currentUserStore'
import useFormState from '../../../hooks/form/useFormState'
import { useUserReportStore } from '../../../stores/user/userReportStore'

export const useCreateTeamForm = (onSuccess?: () => void) => {
  const { user } = useCurrentUserStore()
  const { todayReport } = useUserReportStore()

  const { formState, hasEmptyInput, createInputProps } = useFormState<{
    name: string
  }>({ name: '' })

  const { asyncStatus, callAsyncFunction } = useAsyncHandler()

  const handleSubmit = async () => {
    if (!user) return
    const todayStudyTime = todayReport?.studyTime || 0

    callAsyncFunction(handleCreateTeam, [user, todayStudyTime, formState.name])
  }

  useEffect(() => {
    if (asyncStatus === 'success') {
      onSuccess?.()
    }
  }, [asyncStatus])

  return {
    createInputProps,
    hasEmptyInput,
    handleSubmit,
    isLoading: asyncStatus === 'loading',
  }
}
