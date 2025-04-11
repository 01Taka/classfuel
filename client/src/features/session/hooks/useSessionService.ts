import useCurrentUser from '../../../hooks/useCurrentUser'

const useSessionService = () => {
  const { user } = useCurrentUser()
  const session = user?.session || null

  const handleStartSession = () => {}
}

export default useSessionService
