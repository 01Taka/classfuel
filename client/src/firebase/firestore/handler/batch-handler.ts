import { CollectionReference, doc, WriteBatch } from 'firebase/firestore'
import { BaseDocumentWrite } from '../../../types/firebase/firestore-document-types'

function handleFirestoreError(error: unknown, operation: string): never {
  console.error(`Firestore ${operation} error:`, error)
  throw new Error(
    `Failed to ${operation} document: ${error instanceof Error ? error.message : String(error)}`
  )
}

class BatchHandler {
  static set(
    batch: WriteBatch,
    data: BaseDocumentWrite,
    collectionRef: CollectionReference,
    documentId: string | null
  ): void {
    try {
      const docRef = documentId
        ? doc(collectionRef, documentId)
        : doc(collectionRef)
      batch.set(docRef, data)
    } catch (error) {
      handleFirestoreError(error, 'set')
    }
  }

  static update(
    batch: WriteBatch,
    data: Partial<BaseDocumentWrite>,
    collectionRef: CollectionReference,
    documentId: string
  ): void {
    try {
      const docRef = doc(collectionRef, documentId)
      batch.update(docRef, data as BaseDocumentWrite)
    } catch (error) {
      handleFirestoreError(error, 'update')
    }
  }

  static delete(
    batch: WriteBatch,
    collectionRef: CollectionReference,
    documentId: string
  ): void {
    try {
      const docRef = doc(collectionRef, documentId)
      batch.delete(docRef)
    } catch (error) {
      handleFirestoreError(error, 'delete')
    }
  }
}

export default BatchHandler
