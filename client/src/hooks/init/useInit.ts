import useInitActiveTeamMembers from './useInitActiveTeamMembers'
import useInitStats from './useInitStats'
import useInitTeam from './useInitTeam'
import useInitUser from './useInitUser'

const useInit = () => {
  useInitUser()
  useInitStats()
  useInitTeam()
  useInitActiveTeamMembers()
}

export default useInit
