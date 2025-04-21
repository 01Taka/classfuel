import { DocumentReference, WriteBatch } from 'firebase/firestore'
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
    docRef: DocumentReference
  ): void {
    try {
      batch.set(docRef, data)
    } catch (error) {
      handleFirestoreError(error, 'set')
    }
  }

  static update(
    batch: WriteBatch,
    data: Partial<BaseDocumentWrite>,
    docRef: DocumentReference
  ): void {
    try {
      batch.update(docRef, data as BaseDocumentWrite)
    } catch (error) {
      handleFirestoreError(error, 'update')
    }
  }

  static delete(batch: WriteBatch, docRef: DocumentReference): void {
    try {
      batch.delete(docRef)
    } catch (error) {
      handleFirestoreError(error, 'delete')
    }
  }
}

export default BatchHandler
