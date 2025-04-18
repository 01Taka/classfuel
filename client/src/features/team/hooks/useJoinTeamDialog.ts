import { useState } from 'react'
import { generateTeamCodeUrl } from '../../../functions/team-code-utils'

export const useJoinTeamDialog = () => {
  const [teamCode, setTeamCode] = useState('')
  const [openInput, setOpenInput] = useState(false)
  const [openInfo, setOpenInfo] = useState<{
    name: string
    code: string
    url: string
  } | null>(null)

  const openTeamCodeInfo = (name: string, code: string) => {
    setOpenInfo({ name, code, url: generateTeamCodeUrl(code) })
  }

  return {
    teamCode,
    setTeamCode,
    openInput,
    setOpenInput,
    openInfo,
    setOpenInfo,
    openTeamCodeInfo,
  }
}
