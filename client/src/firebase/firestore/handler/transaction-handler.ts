import { CollectionReference, doc, Transaction } from 'firebase/firestore'
import { BaseDocumentWrite } from '../../../types/firebase/firestore-document-types'

class TransactionHandler {
  static set(
    transaction: Transaction,
    data: BaseDocumentWrite,
    collectionRef: CollectionReference,
    documentId: string | null
  ): void {
    const docRef = documentId
      ? doc(collectionRef, documentId)
      : doc(collectionRef)
    transaction.set(docRef, data)
  }

  static update(
    transaction: Transaction,
    data: Partial<BaseDocumentWrite>,
    collectionRef: CollectionReference,
    documentId: string
  ): void {
    const docRef = doc(collectionRef, documentId)
    transaction.update(docRef, data as BaseDocumentWrite)
  }

  static delete(
    transaction: Transaction,
    collectionRef: CollectionReference,
    documentId: string
  ): void {
    const docRef = doc(collectionRef, documentId)
    transaction.delete(docRef)
  }
}

export default TransactionHandler
