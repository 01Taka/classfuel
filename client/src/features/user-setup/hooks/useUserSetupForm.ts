import useFormState from '../../../hooks/form/useFormState'
import { ISODate } from '../../../types/datetime-types'
import { Gender } from '../../../types/firebase/util-document-types'

export interface UserSetUpFormState {
  displayName: string
  birthdate: ISODate | ''
  gender: Gender | ''
}

export const useUserSetupForm = () => {
  return useFormState<UserSetUpFormState>({
    displayName: '',
    birthdate: '',
    gender: '',
  })
}
