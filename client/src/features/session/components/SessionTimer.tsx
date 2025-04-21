import React from 'react'
import StudyTimer from './molecules/StudyTimer'
import BreakTimer from './molecules/BreakTimer'
import { FormControlLabel, Checkbox } from '@mui/material'
import Btn from '../../../components/atoms/Btn'
import useSessionTimerController from '../hooks/useSessionTimerController'
import {
  breakTimeChoices,
  studyTimeChoices,
} from '../../../constants/session-time-constants'

const SessionTimer: React.FC = () => {
  const {
    session,
    remainingTime,
    elapsedTime,
    isRunning,
    nextStudyTime,
    setNextStudyTime,
    isPlaySound,
    handleFinish,
    onStopSession,
    onRestartSession,
    handleBreak,
    handleToggleSound,
  } = useSessionTimerController()

  return (
    <div>
      {session?.type === 'study' ? (
        <StudyTimer
          remainingTime={remainingTime}
          elapsedTime={elapsedTime}
          isRunning={isRunning}
          breakTimeChoices={[...breakTimeChoices]}
          onStop={onStopSession}
          onRestart={onRestartSession}
          onFinish={handleFinish}
          onBreak={handleBreak}
        />
      ) : (
        <BreakTimer
          remainingTime={remainingTime}
          nextStudyTime={nextStudyTime}
          nextStudyTimeChoices={[...studyTimeChoices]}
          setNextStudyTime={setNextStudyTime}
        />
      )}

      <Btn
        variant="text"
        onClick={handleFinish}
        sx={{ position: 'fixed', top: 0, right: 0 }}
      >
        <span>終了</span>
      </Btn>

      <FormControlLabel
        sx={{ position: 'fixed', top: 5, left: 10 }}
        control={
          <Checkbox
            checked={isPlaySound}
            onChange={(e) => handleToggleSound(e)}
          />
        }
        label="アラームを鳴らす"
      />
    </div>
  )
}

export default SessionTimer
