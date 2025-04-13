import React from 'react'
import SessionScreenLayout from '../templates/SessionScreenLayout'

interface SessionProps {}

const Session: React.FC<SessionProps> = ({}) => {
  console.log('Session')

  return (
    <div>
      <SessionScreenLayout />
    </div>
  )
}

export default Session
