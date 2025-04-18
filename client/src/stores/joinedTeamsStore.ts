// stores/useUserStore.ts
import { create } from 'zustand'
import { UserJoinedTeamRead } from '../types/firebase/firestore-documents/users/user-joined-team-document'

interface JoinedTeamsStore {
  joinedTeams: UserJoinedTeamRead[] | null
  setJoinedTeams: (teams: UserJoinedTeamRead[] | null) => void
}

export const useJoinedTeamsStore = create<JoinedTeamsStore>((set) => ({
  joinedTeams: [],
  setJoinedTeams: (teams) => set({ joinedTeams: teams }),
}))
