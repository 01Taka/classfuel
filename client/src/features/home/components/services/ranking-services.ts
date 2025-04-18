import { TeamMemberRepository } from '../../../../firebase/firestore/repositories/teams/team-member-repository'

const teamMemberRepo = new TeamMemberRepository()

export const getRanking = async (
  teamId: string,
  studyTime: number
): Promise<number> => {
  const members = await teamMemberRepo.getAll([teamId])
  const todayStudyTimes = members.map((member) => member.todayStudyTime)
  todayStudyTimes.sort((a, b) => b - a)

  return todayStudyTimes.indexOf(studyTime) + 1
}
