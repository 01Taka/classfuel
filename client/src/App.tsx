import { Routes, Route } from 'react-router-dom'
import NotFound from './components/pages/error/NotFound'
import Home from './components/pages/Home'
import Chat from './components/pages/Chat'
import Session from './components/pages/Session'
import useInit from './hooks/init/useInit'
import UserSetupPage from './components/pages/UserSetupPage'
import LoginPage from './components/pages/LoginPage'
import JoinTeamPage from './components/pages/JoinTeamPage'

function App() {
  useInit()

  return (
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/session" element={<Session />} />
      <Route path="join-team/:code" element={<JoinTeamPage />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/user-setup" element={<UserSetupPage />} />
    </Routes>
  )
}

export default App
