import useInitActiveTeamMembers from './useInitActiveTeamMembers'
import useInitReport from './useInitReport'
import useInitStats from './useInitStats'
import useInitTeam from './useInitTeam'
import useInitUser from './useInitUser'

const useInit = () => {
  useInitUser()
  useInitStats()
  useInitTeam()
  useInitActiveTeamMembers()
  useInitReport()
}

export default useInit
