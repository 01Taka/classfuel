import { useNavigate, useSearchParams } from 'react-router-dom'
import { signInWithGoogle } from '../services/google-auth-service'

const NEXT_PAGE = '/user-setup'

export const useGoogleLogin = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const teamCode = searchParams.get('team-code')

  const handleLogin = async () => {
    try {
      await signInWithGoogle()
      navigate(teamCode ? `${NEXT_PAGE}?team-code=${teamCode}` : NEXT_PAGE)
    } catch (error) {
      console.error('ログインエラー:', error)
      alert('ログインに失敗しました')
    }
  }

  return { handleLogin }
}
