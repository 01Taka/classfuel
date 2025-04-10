import { Card, Stack, Typography } from '@mui/material'
import React from 'react'
import OptionButtonGroup from '../molecules/OptionButtonGroup'
import { blue } from '@mui/material/colors'
import MessageComposer from '../molecules/MessageComposer'

interface ChoicePanelProps {}

const ChoicePanel: React.FC<ChoicePanelProps> = ({}) => {
  return (
    <Card>
      <Stack alignItems="center" padding={2} bgcolor={blue[100]}>
        <Typography variant="h6">返信</Typography>
        <OptionButtonGroup
          options={[
            { id: '0', text: 'A' },
            { id: '1', text: 'B' },
          ]}
          onClick={() => {}}
        />
      </Stack>
      <MessageComposer onSendText={() => {}} />
    </Card>
  )
}

export default ChoicePanel
