// stores/useUserStore.ts
import { create } from 'zustand'
import { TeamMemberRead } from '../types/firebase/firestore-documents/teams/team-member-document'

interface JoinedTeamsStore {
  members: TeamMemberRead[]
  setActiveTeamMembers: (members: TeamMemberRead[]) => void
}

export const useActiveTeamMembersStore = create<JoinedTeamsStore>((set) => ({
  members: [],
  setActiveTeamMembers: (members) => set({ members }),
}))
