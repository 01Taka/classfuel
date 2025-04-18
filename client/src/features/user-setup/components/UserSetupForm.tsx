import { Box, Button } from '@mui/material'
import FormTextField from '../../../components/atoms/form/FormTextField'
import { useUserSetupForm } from '../hooks/useUserSetupForm'
import FormSelect from '../../../components/atoms/form/FormSelect'

interface Props {
  onSubmit: (
    formState: ReturnType<typeof useUserSetupForm>['formState']
  ) => void
}

const UserSetupForm = ({ onSubmit }: Props) => {
  const { formState, hasEmptyInput, createInputProps } = useUserSetupForm()

  return (
    <Box display="flex" flexDirection="column" gap={3} mt={2}>
      <FormTextField
        label="ニックネーム"
        {...createInputProps('displayName')}
      />
      <FormTextField
        label="生年月日"
        type="date"
        {...createInputProps('birthdate')}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
      />
      <FormSelect
        label="性別"
        options={[
          { value: 'male', label: '男性' },
          { value: 'female', label: '女性' },
          { value: 'other', label: 'その他' },
        ]}
        {...createInputProps('gender')}
      />
      <Button
        variant="contained"
        onClick={() => onSubmit(formState)}
        sx={{ borderRadius: 3 }}
        disabled={hasEmptyInput}
      >
        保存して進む
      </Button>
    </Box>
  )
}

export default UserSetupForm
