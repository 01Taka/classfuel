import { useMemo } from 'react'
import { UserRepository } from '../firebase/firestore/repositories/user/user-repository'
import { useUsersStore } from '../stores/usersStore'
import { UserRead } from '../types/firebase/firestore-documents/user/user-document'

const useUserService = () => {
  const { users, setUser } = useUsersStore()
  const userRepo = useMemo(() => new UserRepository(), [])

  /**
   * キャッシュされていれば返し、なければFirestoreから取得してキャッシュする
   */
  const fetchUserById = async (userId: string): Promise<UserRead | null> => {
    const cached = users[userId]
    if (cached) return cached

    const user = await userRepo.read(userId)
    if (!user) return null

    setUser(user)
    return user
  }

  /**
   * キャッシュからのみ取得（Firestoreへはアクセスしない）
   */
  const getCachedUserById = (userId: string): UserRead | null => {
    return users[userId] ?? null
  }

  /**
   * uidの配列を受け取って、ユーザーデータのRecordを返す
   */
  const fetchUsersByIds = async (
    userIds: string[]
  ): Promise<Record<string, UserRead>> => {
    const result: Record<string, UserRead> = {}

    const uncachedIds: string[] = []
    for (const id of userIds) {
      const cached = users[id]
      if (cached) {
        result[id] = cached
      } else {
        uncachedIds.push(id)
      }
    }

    // 未キャッシュのユーザーを一括取得（必要なら一括取得APIに変更も可）
    const fetchedUsers = await Promise.all(
      uncachedIds.map((id) => userRepo.read(id))
    )
    fetchedUsers.forEach((user) => {
      if (user) {
        result[user.id] = user
        setUser(user)
      }
    })

    return result
  }

  return {
    fetchUserById,
    getCachedUserById,
    fetchUsersByIds,
  }
}

export default useUserService
