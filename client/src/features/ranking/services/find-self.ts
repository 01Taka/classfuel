import { TeamMemberRead } from '../../../types/firebase/firestore-documents/teams/team-member-document'

export const findSelfInMembers = (
  uid: string,
  members: TeamMemberRead[]
): { index: number; member: TeamMemberRead } | null => {
  const index = members.findIndex((member) => member.docId === uid)
  if (index === -1) return null
  return {
    index,
    member: members[index],
  }
}
