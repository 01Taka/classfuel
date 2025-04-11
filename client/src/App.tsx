import { Routes, Route } from 'react-router-dom'
import NotFound from './components/pages/error/NotFound'
import Home from './components/pages/Home'
import Login from './components/pages/auth/Login'
import UserSetup from './components/pages/auth/UserSetup'
import Chat from './components/pages/Chat'
import VoiceShare from './components/pages/VoiceShare'
import Session from './components/pages/Session'

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/voice-share" element={<VoiceShare />} />
      <Route path="/session" element={<Session />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user-setup" element={<UserSetup />} />
    </Routes>
  )
}

export default App
