import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  query,
  where,
  limit,
  startAfter,
  orderBy,
  QueryConstraint,
  SetOptions,
} from 'firebase/firestore'
import { parseDocumentSnapshot, parseQuerySnapshot } from '../snapshotUtils'
import {
  BaseDocument,
  BaseDocumentRead,
} from '../../../types/firebase/firestore-document-types'

export class CRUDHandler {
  /**
   * Firestore操作をハンドリングする共通ユーティリティ
   */
  private static async handleFirestoreOperation<T>(
    operation: Promise<T>,
    action: string,
    context?: string
  ): Promise<T> {
    try {
      return await operation
    } catch (error) {
      console.error(
        `[Firestore Error] ${action}${context ? ` (${context})` : ''}:`,
        error
      )
      throw new Error(`[Firestore Error] ${action} failed.`)
    }
  }

  /**
   * ドキュメントを作成する
   * @param collectionRef 書き込み対象の CollectionReference
   * @param data 作成するドキュメントのデータ
   * @returns 作成されたドキュメントの参照
   */
  public static async create<Write extends BaseDocument>(
    collectionRef: CollectionReference,
    data: Write
  ): Promise<DocumentReference<Write>> {
    const result = await this.handleFirestoreOperation(
      addDoc(collectionRef, data),
      'Failed to create document'
    )
    return result as DocumentReference<Write>
  }

  /**
   * 指定したIDでドキュメントを作成する
   * @param collectionRef 書き込み対象の CollectionReference
   * @param documentId 作成するドキュメントのID
   * @param data 作成するドキュメントのデータ
   * @param merge 既存ドキュメントへのマージフラグ（デフォルト false）
   */
  public static async createWithId(
    docRef: DocumentReference,
    data: BaseDocument,
    options: SetOptions = {}
  ): Promise<void> {
    await this.handleFirestoreOperation(
      setDoc(docRef, data, options),
      'Failed to create document with ID'
    )
  }

  /**
   * ドキュメントの DocumentSnapshot を取得する
   * @param collectionRef 読み込み対象の CollectionReference
   * @param documentId 読み込むドキュメントのID
   */
  public static async readAsDocumentSnapshot<Read extends BaseDocumentRead>(
    docRef: DocumentReference<Read>
  ): Promise<DocumentSnapshot<Read>> {
    return this.handleFirestoreOperation(
      getDoc(docRef),
      'Failed to read document snapshot'
    )
  }

  /**
   * ドキュメントを読み込み、データを返す（存在しない場合は null）
   * @param collectionRef 読み込み対象の CollectionReference
   * @param documentId 読み込むドキュメントのID
   */
  public static async read<Read extends BaseDocumentRead>(
    docRef: DocumentReference
  ): Promise<Read | null> {
    const docSnapshot = await this.readAsDocumentSnapshot(
      docRef as DocumentReference<Read>
    )
    return parseDocumentSnapshot<Read>(docSnapshot)
  }

  /**
   * ドキュメントを更新する
   * @param collectionRef 書き込み対象の CollectionReference
   * @param documentId 更新するドキュメントのID
   * @param data 更新する部分的なデータ
   */
  public static async update(
    docRef: DocumentReference,
    data: BaseDocument
  ): Promise<void> {
    await this.handleFirestoreOperation(
      updateDoc(docRef, data),
      'Failed to update document'
    )
  }

  /**
   * ドキュメントを物理削除する
   * @param collectionRef 対象の CollectionReference
   * @param documentId 削除するドキュメントのID
   */
  public static async delete(docRef: DocumentReference): Promise<void> {
    await this.handleFirestoreOperation(
      deleteDoc(docRef),
      'Failed to hard delete document'
    )
  }

  /**
   * 条件に合致するすべてのドキュメントを QuerySnapshot として取得する
   * @param collectionRef 読み込み対象の CollectionReference
   * @param queryConstraints クエリ制約条件
   */
  public static async getAllAsQuerySnapshot<Read extends BaseDocumentRead>(
    collectionRef: CollectionReference<Read>,
    ...queryConstraints: QueryConstraint[]
  ): Promise<QuerySnapshot<Read>> {
    const q = query(
      collectionRef,
      where('isActive', '==', true),
      ...queryConstraints
    )
    return this.handleFirestoreOperation(
      getDocs(q),
      'Failed to get query snapshot'
    )
  }

  /**
   * 条件に合致するすべてのドキュメントのデータを配列として取得する
   * @param collectionRef 読み込み対象の CollectionReference
   * @param queryConstraints クエリ制約条件
   */
  public static async getAll<Read extends BaseDocumentRead>(
    collectionRef: CollectionReference,
    ...queryConstraints: QueryConstraint[]
  ): Promise<Read[]> {
    const querySnapshot = await this.getAllAsQuerySnapshot(
      collectionRef as CollectionReference<Read>,
      ...queryConstraints
    )
    return parseQuerySnapshot<Read>(querySnapshot)
  }

  /**
   * 指定されたフィールドと値に一致する最初のドキュメントを取得する
   * @param collectionRef 読み込み対象の CollectionReference
   * @param field 検索するフィールド名
   * @param value 検索する値
   * @param throwIfNotFound 見つからなかった場合にエラーをスローするかどうか（デフォルト: false）
   */
  public static async getFirstMatch<Read extends BaseDocumentRead>(
    collectionRef: CollectionReference,
    field: keyof Read,
    value: any,
    throwIfNotFound: boolean = false
  ): Promise<Read | null> {
    const q = query(
      collectionRef,
      where(field as string, '==', value),
      where('isActive', '==', true),
      limit(1)
    )

    const querySnapshot = await this.handleFirestoreOperation(
      getDocs(q),
      'Failed to get first match'
    )

    if (!querySnapshot || querySnapshot.empty) {
      if (throwIfNotFound) {
        throw new Error(
          `[Firestore Error] No matching document found for ${String(field)} = ${value}`
        )
      }
      return null
    }

    return parseDocumentSnapshot<Read>(querySnapshot.docs[0])
  }

  /**
   * クエリ制約を動的に構築するヘルパー
   * @param startAfterDoc ページングのための開始ドキュメント
   * @param limitCount 取得上限数
   * @param additionalConstraints その他のクエリ制約
   */
  private static buildQueryConstraints<T>(
    startAfterDoc?: DocumentSnapshot<T>,
    limitCount?: number,
    additionalConstraints: QueryConstraint[] = []
  ): QueryConstraint[] {
    const constraints: QueryConstraint[] = [
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
    ]
    if (startAfterDoc) {
      constraints.push(startAfter(startAfterDoc))
    }
    if (limitCount !== undefined) {
      constraints.push(limit(limitCount))
    }
    return constraints.concat(additionalConstraints)
  }

  /**
   * 指定されたドキュメントの後からクエリを開始し、ページネーションを行う
   * @param collectionRef 読み込み対象の CollectionReference
   * @param startAfterDoc ページング開始位置のドキュメントスナップショット
   * @param limitCount 取得する最大ドキュメント数
   * @param queryConstraints その他のクエリ制約
   */
  public static async getAllWithPagination<Read extends BaseDocumentRead>(
    collectionRef: CollectionReference,
    startAfterDoc?: DocumentSnapshot<Read>,
    limitCount?: number,
    ...queryConstraints: QueryConstraint[]
  ): Promise<Read[]> {
    const constraints = this.buildQueryConstraints(
      startAfterDoc,
      limitCount,
      queryConstraints
    )
    const fullQuery = query(collectionRef, ...constraints)
    const querySnapshot = await this.handleFirestoreOperation(
      getDocs(fullQuery),
      'Failed to get paginated data'
    )
    return parseQuerySnapshot<Read>(querySnapshot)
  }
}
