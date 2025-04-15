import { CollectionReference, doc, WriteBatch } from 'firebase/firestore'
import { BaseDocumentWrite } from '../../../types/firebase/firestore-document-types'

class BatchHandler {
  static set(
    batch: WriteBatch,
    data: BaseDocumentWrite,
    collectionRef: CollectionReference,
    documentId: string | null
  ): void {
    const docRef = documentId
      ? doc(collectionRef, documentId)
      : doc(collectionRef)
    batch.set(docRef, data)
  }

  static update(
    batch: WriteBatch,
    data: Partial<BaseDocumentWrite>,
    collectionRef: CollectionReference,
    documentId: string
  ): void {
    const docRef = doc(collectionRef, documentId)
    batch.update(docRef, data as BaseDocumentWrite)
  }

  static delete(
    batch: WriteBatch,
    collectionRef: CollectionReference,
    documentId: string
  ): void {
    const docRef = doc(collectionRef, documentId)
    batch.delete(docRef)
  }
}

export default BatchHandler
