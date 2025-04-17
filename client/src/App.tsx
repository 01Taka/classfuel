import { Routes, Route } from 'react-router-dom'
import NotFound from './components/pages/error/NotFound'
import Home from './components/pages/Home'
import Login from './components/pages/auth/Login'
import UserSetup from './components/pages/auth/UserSetup'
import Chat from './components/pages/Chat'
import Session from './components/pages/Session'
import useInit from './hooks/init/useInit'
import JoinTeam from './components/pages/JoinTeam'

function App() {
  useInit()

  return (
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/session" element={<Session />} />
      <Route path="join-team/:code" element={<JoinTeam />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user-setup" element={<UserSetup />} />
    </Routes>
  )
}

export default App
