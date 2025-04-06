import {
  CollectionReference,
  doc,
  DocumentData,
  DocumentSnapshot,
  Firestore,
  runTransaction,
  Transaction,
} from 'firebase/firestore'
import {
  BaseDocument,
  BaseDocumentRead,
} from '../../../types/firebase/firestore-document-types'

class TransactionHandler<
  Read extends BaseDocumentRead,
  Write extends BaseDocument,
> {
  // コレクションごとにアクティブなトランザクションを管理するマップ
  private transactions: Map<string, Transaction> = new Map()

  constructor(private firestore: Firestore) {}

  /**
   * 指定されたコレクションRefに対してトランザクションを開始し、トランザクション内の処理を実行します。
   * コレクションRefのパスをキーとして、同じコレクションに対する複数のトランザクションが同時に走らないように管理します。
   *
   * @param collectionRef 対象のコレクションRef
   * @param transactionCallback トランザクション内で実行する処理
   * @returns transactionCallback の結果
   */
  async runTransaction<T>(
    collectionRef: CollectionReference<DocumentData>,
    transactionCallback: (transaction: Transaction) => Promise<T>
  ): Promise<T> {
    const key = collectionRef.path
    if (this.transactions.has(key)) {
      throw new Error('Transaction already in progress for this collection.')
    }
    return await runTransaction(this.firestore, async (transaction) => {
      this.transactions.set(key, transaction)
      try {
        return await transactionCallback(transaction)
      } finally {
        this.transactions.delete(key)
      }
    })
  }

  /**
   * 指定されたコレクションRefに対するアクティブなトランザクションを取得します。
   * トランザクションが存在しない場合はエラーをスローします。
   *
   * @param collectionRef 対象のコレクションRef
   */
  private getActiveTransaction(
    collectionRef: CollectionReference<DocumentData>
  ): Transaction {
    const key = collectionRef.path
    const transaction = this.transactions.get(key)
    if (!transaction) {
      throw new Error(
        'No active transaction for this collection. Please start a transaction first.'
      )
    }
    return transaction
  }

  /**
   * トランザクション内で指定されたドキュメントを取得します。
   *
   * @param collectionRef 対象のコレクションRef
   * @param documentId ドキュメントのID
   * @returns ドキュメントのSnapshot
   */
  async get(
    collectionRef: CollectionReference<Read>,
    documentId: string
  ): Promise<DocumentSnapshot<Read>> {
    const transaction = this.getActiveTransaction(collectionRef)
    const docRef = doc(collectionRef, documentId)
    return await transaction.get(docRef)
  }

  /**
   * トランザクション内でドキュメントを作成（セット）します。
   *
   * @param collectionRef 対象のコレクションRef
   * @param documentId 作成するドキュメントのID
   * @param data 作成するデータ
   */
  set(
    collectionRef: CollectionReference,
    documentId: string,
    data: Write
  ): void {
    const transaction = this.getActiveTransaction(collectionRef)
    const docRef = doc(collectionRef, documentId)
    transaction.set(docRef, data)
  }

  /**
   * トランザクション内でドキュメントを更新します。
   *
   * @param collectionRef 対象のコレクションRef
   * @param documentId 更新するドキュメントのID
   * @param data 更新するデータ（部分更新）
   */
  update(
    collectionRef: CollectionReference,
    documentId: string,
    data: Partial<Write>
  ): void {
    const transaction = this.getActiveTransaction(collectionRef)
    const docRef = doc(collectionRef, documentId)
    transaction.update(docRef, data as Write)
  }

  /**
   * トランザクション内でドキュメントを削除します。
   *
   * @param collectionRef 対象のコレクションRef
   * @param documentId 削除するドキュメントのID
   */
  delete(collectionRef: CollectionReference, documentId: string): void {
    const transaction = this.getActiveTransaction(collectionRef)
    const docRef = doc(collectionRef, documentId)
    transaction.delete(docRef)
  }
}

export default TransactionHandler
