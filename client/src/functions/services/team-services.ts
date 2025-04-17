import { db } from '../../firebase/firebase'
import TransactionManager from '../../firebase/firestore/handler/transaction-manager'
import { TeamCodeRepository } from '../../firebase/firestore/repositories/team-codes/team-code-repository'
import { TeamMemberRepository } from '../../firebase/firestore/repositories/teams/team-member-repository'
import { TeamRepository } from '../../firebase/firestore/repositories/teams/team-repository'
import { UserJoinedTeamRepository } from '../../firebase/firestore/repositories/users/user-joined-team-repository'
import { TeamRead } from '../../types/firebase/firestore-documents/teams/team-document'
import { UserRead } from '../../types/firebase/firestore-documents/users/user-document'

const userJoinedTeamRepo = new UserJoinedTeamRepository()
const teamRepo = new TeamRepository()
const teamMemberRepo = new TeamMemberRepository()
const teamCodeRepo = new TeamCodeRepository()

export const handleCreateTeam = async (
  user: UserRead,
  todayStudyTime: number,
  teamName: string
) => {
  try {
    const transactionManager = new TransactionManager(db)
    await transactionManager.runInTransaction(async () => {
      const teamId = teamRepo.getDocumentRefWithAutoId().id
      teamRepo.setInTransaction(
        {
          name: teamName,
          codeId: '',
        },
        teamId
      )

      const teamCode = teamCodeRepo.getDocumentRefWithAutoId().id

      teamCodeRepo.setInTransaction({ teamId: teamId }, teamCode)

      teamRepo.updateInTransaction({ codeId: teamCode }, teamId)

      userJoinedTeamRepo.setInTransaction({ name: teamName }, teamId, [
        user.docId,
      ])

      teamMemberRepo.setInTransaction(
        { ...user, iconUrl: '', todayStudyTime },
        user.docId,
        [teamId]
      )
    }, [teamRepo, userJoinedTeamRepo, teamMemberRepo, teamCodeRepo])
  } catch (error) {
    console.error('handleCreateTeam にてエラー:', error)
    throw new Error('チーム作成中にエラーが発生しました')
  }
}

export const handleJoinTeam = async (
  user: UserRead,
  todayStudyTime: number,
  teamCodeId: string
) => {
  const transactionManager = new TransactionManager(db)

  try {
    await transactionManager.runInTransaction(async () => {
      const teamCode = await teamCodeRepo.getInTransaction(teamCodeId)
      if (!teamCode?.teamId) {
        throw new Error('Invalid team code: team ID not found.')
      }

      const team = await teamRepo.getInTransaction(teamCode.teamId)
      if (!team) {
        throw new Error(`Team not found for ID: ${teamCode.teamId}`)
      }

      const isAlreadyMember = await teamMemberRepo.getInTransaction(
        user.docId,
        [team.docId]
      )
      if (isAlreadyMember) {
        throw new Error('User is already a member of this team.')
      }

      userJoinedTeamRepo.setInTransaction({ name: team.name }, team.docId, [
        user.docId,
      ])

      teamMemberRepo.setInTransaction(
        { ...user, iconUrl: '', todayStudyTime },
        user.docId,
        [team.docId]
      )
    }, [teamRepo, userJoinedTeamRepo, teamMemberRepo, teamCodeRepo])
  } catch (error) {
    console.error('handleJoinTeam error:', error)
    throw new Error('チーム参加中にエラーが発生しました')
  }
}

export const handleFetchTeamByCode = async (
  code: string
): Promise<TeamRead | null> => {
  const teamCode = await teamCodeRepo.read(code)

  if (!teamCode) {
    console.error(`Team code not found for code: ${code}`)
    return null
  }
  const team = await teamRepo.read(teamCode.teamId)
  return team
}

export const getMemberData = async (userId: string, teamId: string) => {
  return await teamMemberRepo.read(userId, [teamId])
}
