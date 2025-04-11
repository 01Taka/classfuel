import React from 'react'
import SwitchButton from '../atoms/SwitchButton'
import StartButton from '../atoms/StartButton'
import ContainerCard from '../atoms/ContainerCard'
import { useNavigate } from 'react-router-dom'
import useSessionService from '../../features/session/hooks/useSessionService'
import { MINUTES_IN_MILLISECOND } from '../../constants/datetime-constants'

interface StartPanelProps {}

const StartPanel: React.FC<StartPanelProps> = ({}) => {
  const { handleStartSession } = useSessionService()
  const [mode, setMode] = React.useState<'study' | 'break'>('study')
  const navigate = useNavigate()

  const startButtonSettings = {
    study: [
      { timeMin: 10, explanation: 'ウォーミングアップ' },
      { timeMin: 25, explanation: '短く一気に集中' },
      { timeMin: 60, explanation: 'じっくり長めに集中' },
    ],
    break: [
      { timeMin: 1, explanation: 'ちょっと休憩' },
      { timeMin: 3, explanation: '気分転換' },
      { timeMin: 5, explanation: 'リフレッシュ' },
    ],
  }

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
          key={setting.timeMin}
          timeMin={setting.timeMin}
          explanation={setting.explanation}
          onClick={() =>
            handleStart(mode, setting.timeMin * MINUTES_IN_MILLISECOND)
          }
        />
      ))}
    </ContainerCard>
  )
}

export default StartPanel
