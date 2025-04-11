import React from 'react'
import SwitchButton from '../atoms/SwitchButton'
import StartButton from '../atoms/StartButton'
import ContainerCard from '../atoms/ContainerCard'
import { useNavigate } from 'react-router-dom'

interface StartPanelProps {}

const StartPanel: React.FC<StartPanelProps> = ({}) => {
  const [mode, setMode] = React.useState<'studying' | 'break'>('studying')
  const navigate = useNavigate()

  const startButtonSettings = {
    studying: [
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

  const handleStartSession = (mode: 'studying' | 'break') => {
    navigate('/session')
  }

  return (
    <ContainerCard>
      <SwitchButton
        leftLabel="勉強する"
        rightLabel="休憩する"
        selectedValue={mode === 'studying' ? 'left' : 'right'}
        onChange={(value) => {
          setMode(value === 'left' ? 'studying' : 'break')
        }}
      />
      {startButtonSettings[mode].map((setting) => (
        <StartButton
          key={setting.timeMin}
          timeMin={setting.timeMin}
          explanation={setting.explanation}
          onClick={() => handleStartSession(mode)}
        />
      ))}
    </ContainerCard>
  )
}

export default StartPanel
