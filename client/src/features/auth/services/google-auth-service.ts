import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../../../firebase/firebase'

const provider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
  return await signInWithPopup(auth, provider)
}
