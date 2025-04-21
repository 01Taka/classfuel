import {
  DocumentReference,
  DocumentSnapshot,
  Transaction,
} from 'firebase/firestore'
import {
  BaseDocumentRead,
  BaseDocumentWrite,
} from '../../../types/firebase/firestore-document-types'

function handleFirestoreError(error: unknown, operation: string): never {
  // エラーロギングや通知をここで実行できる
  console.error(`Firestore ${operation} error:`, error)
  throw new Error(
    `Failed to ${operation} document: ${error instanceof Error ? error.message : String(error)}`
  )
}

class TransactionHandler {
  static async get<T extends BaseDocumentRead>(
    transaction: Transaction,
    docRef: DocumentReference
  ): Promise<DocumentSnapshot<T>> {
    try {
      const result = await transaction.get(docRef)
      return result as DocumentSnapshot<T>
    } catch (error) {
      handleFirestoreError(error, 'get')
    }
  }

  static set(
    transaction: Transaction,
    data: BaseDocumentWrite,
    docRef: DocumentReference
  ): void {
    try {
      transaction.set(docRef, data)
    } catch (error) {
      handleFirestoreError(error, 'set')
    }
  }

  static update(
    transaction: Transaction,
    data: Partial<BaseDocumentWrite>,
    docRef: DocumentReference
  ): void {
    try {
      transaction.update(docRef, data as BaseDocumentWrite)
    } catch (error) {
      handleFirestoreError(error, 'update')
    }
  }

  static delete(transaction: Transaction, docRef: DocumentReference): void {
    try {
      transaction.delete(docRef)
    } catch (error) {
      handleFirestoreError(error, 'delete')
    }
  }
}

export default TransactionHandler
