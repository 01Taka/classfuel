import React from 'react'
import SwitchButton from '../atoms/SwitchButton'
import StartButton from '../atoms/StartButton'
import ContainerCard from '../atoms/ContainerCard'

interface StartPanelProps {}

const StartPanel: React.FC<StartPanelProps> = ({}) => {
  const [mode, setMode] = React.useState<'study' | 'rest'>('study')

  const startButtonSettings = {
    study: [
      { timeMin: 5, explanation: 'ウォーミングアップ' },
      { timeMin: 25, explanation: '短く一気に集中' },
      { timeMin: 60, explanation: 'じっくり長めに集中' },
    ],
    rest: [
      { timeMin: 1, explanation: 'ちょっと休憩' },
      { timeMin: 3, explanation: '気分転換' },
      { timeMin: 5, explanation: 'リフレッシュ' },
    ],
  }

  return (
    <ContainerCard>
      <SwitchButton
        leftLabel="勉強する"
        rightLabel="休憩する"
        selectedValue={mode === 'study' ? 'left' : 'right'}
        onChange={(value) => {
          setMode(value === 'left' ? 'study' : 'rest')
        }}
      />
      {startButtonSettings[mode].map((setting) => (
        <StartButton
          key={setting.timeMin}
          timeMin={setting.timeMin}
          explanation={setting.explanation}
        />
      ))}
    </ContainerCard>
  )
}

export default StartPanel
