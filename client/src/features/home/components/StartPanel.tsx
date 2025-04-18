import React from 'react'
import SwitchButton from '../../../components/atoms/SwitchButton'
import StartButton from '../../../components/atoms/StartButton'
import ContainerCard from '../../../components/atoms/ContainerCard'
import { useNavigate } from 'react-router-dom'
import useSessionService from '../../session/hooks/useSessionService'
import {
  breakTimeChoices,
  studyTimeChoices,
} from '../../../constants/session-time-constants'

interface StartPanelProps {}

const startButtonSettings = {
  study: [
    { timeMs: studyTimeChoices[0], explanation: 'ウォーミングアップ' },
    { timeMs: studyTimeChoices[1], explanation: '短く一気に集中' },
    { timeMs: studyTimeChoices[2], explanation: 'じっくり長めに集中' },
  ],
  break: [
    { timeMs: breakTimeChoices[0], explanation: 'ちょっと休憩' },
    { timeMs: breakTimeChoices[1], explanation: '気分転換' },
    { timeMs: breakTimeChoices[2], explanation: 'リフレッシュ' },
  ],
}

const StartPanel: React.FC<StartPanelProps> = ({}) => {
  const { handleStartSession } = useSessionService()
  const [mode, setMode] = React.useState<'study' | 'break'>('study')
  const navigate = useNavigate()

  const handleStart = (mode: 'study' | 'break', duration: number) => {
    handleStartSession(mode, duration)
    navigate('/session')
  }

  return (
    <ContainerCard>
      <SwitchButton
        leftLabel="勉強する"
        rightLabel="休憩する"
        selectedValue={mode === 'study' ? 'left' : 'right'}
        onChange={(value) => {
          setMode(value === 'left' ? 'study' : 'break')
        }}
      />
      {startButtonSettings[mode].map((setting) => (
        <StartButton
          key={setting.timeMs}
          timeMs={setting.timeMs}
          explanation={setting.explanation}
          onClick={() => handleStart(mode, setting.timeMs)}
        />
      ))}
    </ContainerCard>
  )
}

export default StartPanel
