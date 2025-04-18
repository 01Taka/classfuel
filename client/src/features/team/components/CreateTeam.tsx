import { Stack } from '@mui/material'
import { useCreateTeamForm } from '../hooks/useCreateTeamForm'
import FormTextField from '../../../components/atoms/form/FormTextField'
import Btn from '../../../components/atoms/Btn'

interface CreateTeamFormProps {
  onSuccess?: () => void
}

const CreateTeamForm: React.FC<CreateTeamFormProps> = ({ onSuccess }) => {
  const { createInputProps, hasEmptyInput, handleSubmit } =
    useCreateTeamForm(onSuccess)

  return (
    <Stack alignItems="center" spacing={5} sx={{ p: 2, mt: 10 }}>
      <FormTextField {...createInputProps('name')} />
      <Btn variant="contained" disabled={hasEmptyInput} onClick={handleSubmit}>
        チームを作成
      </Btn>
    </Stack>
  )
}

export default CreateTeamForm
