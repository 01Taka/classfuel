import FirestoreService from '../../handler/firestore-service'
import { db } from '../../../firebase'
import {
  TeamDocument,
  TeamRead,
  TeamWrite,
} from '../../../../types/firebase/firestore-documents/teams/team-document'
import { DocumentData, DocumentReference } from 'firebase/firestore'
export class TeamRepository extends FirestoreService<
  TeamRead,
  TeamWrite,
  TeamDocument
> {
  constructor() {
    super(db, ['teams'])
  }

  protected filterWriteData(data: TeamWrite): TeamDocument {
    const { name } = data
    return { name, memberCount: 0 }
  }

  protected filterPartialWriteData(
    data: Partial<TeamWrite>
  ): Partial<TeamDocument> {
    const { name, createdAt, memberCount } = data
    return { name, createdAt, memberCount }
  }

  override async create(
    data: TeamWrite,
    parentDocumentIds: string[] = []
  ): Promise<DocumentReference<TeamWrite, DocumentData>> {
    const teamId = await super.create(data)
    return teamId
  }
}
