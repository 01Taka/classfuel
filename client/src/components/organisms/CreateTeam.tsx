import React from 'react'
import useFormState from '../../hooks/form/useFormState'

interface CreateTeamProps {}

interface FormState {
  teamName: string
}

const CreateTeam: React.FC<CreateTeamProps> = ({}) => {
  const {} = useFormState<FormState>({
    teamName: '',
  })

  return (
    <div>
      <h1>CreateTeamContent</h1>
    </div>
  )
}

export default CreateTeam
