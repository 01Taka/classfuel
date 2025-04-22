import { create } from 'zustand'
import { UserRead } from '../../types/firebase/firestore-documents/users/user-document'

type UsersStore = {
  users: Record<string, UserRead>
  setUser: (user: UserRead) => void
}

export const useUsersStore = create<UsersStore>((set) => ({
  users: {},
  setUser: (user) =>
    set((state) => ({
      users: {
        ...state.users,
        [user.id]: user,
      },
    })),
}))
