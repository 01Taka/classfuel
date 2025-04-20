import useInitActiveTeamMembers from './useInitActiveTeamMembers'
import useInitTeam from './useInitTeam'
import useInitUser from './useInitUser'

const useInit = () => {
  useInitUser()
  useInitTeam()
  useInitActiveTeamMembers()
}

export default useInit
