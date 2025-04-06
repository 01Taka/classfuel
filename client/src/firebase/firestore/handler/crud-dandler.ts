import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  query,
  where,
  limit,
  startAfter,
  orderBy,
  serverTimestamp,
  FieldValue,
  QueryConstraint,
} from 'firebase/firestore'
import { parseDocumentSnapshot, parseQuerySnapshot } from '../snapshotUtils'
import {
  BaseDocument,
  BaseDocumentRead,
  SoftDeleteAdditionalField,
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
   * 作成前の前処理を行う
   * @param data 作成するデータ
   * @param options オプション（setInvalid なら isActive を false に）
   * @returns 前処理後のデータ（createdAt と isActive を付与）
   */
  private static writePreprocessing<Write>(
    data: Write,
    options: {
      setInvalid?: boolean
      additionalFields?: Record<string, any>
    } = {}
  ): Write & { createdAt: FieldValue; isActive: boolean } {
    return {
      ...data,
      createdAt: serverTimestamp(),
      isActive: !options.setInvalid,
      ...options.additionalFields,
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
    const processedData = this.writePreprocessing(data)
    const result = await this.handleFirestoreOperation(
      addDoc(collectionRef, processedData),
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
  public static async createWithId<Write extends BaseDocument>(
    collectionRef: CollectionReference,
    documentId: string,
    data: Write,
    merge: boolean = false
  ): Promise<void> {
    const docRef = doc(collectionRef, documentId)
    await this.handleFirestoreOperation(
      setDoc(docRef, this.writePreprocessing(data), { merge }),
      'Failed to create document with ID',
      documentId
    )
  }

  /**
   * ドキュメントの DocumentSnapshot を取得する
   * @param collectionRef 読み込み対象の CollectionReference
   * @param documentId 読み込むドキュメントのID
   */
  public static async readAsDocumentSnapshot<Read extends BaseDocumentRead>(
    collectionRef: CollectionReference<Read>,
    documentId: string
  ): Promise<DocumentSnapshot<Read>> {
    const docRef = doc(collectionRef, documentId)
    return this.handleFirestoreOperation(
      getDoc(docRef),
      'Failed to read document snapshot',
      documentId
    )
  }

  /**
   * ドキュメントを読み込み、データを返す（存在しない場合は null）
   * @param collectionRef 読み込み対象の CollectionReference
   * @param documentId 読み込むドキュメントのID
   */
  public static async read<Read extends BaseDocumentRead>(
    collectionRef: CollectionReference,
    documentId: string
  ): Promise<Read | null> {
    const docSnapshot = await this.readAsDocumentSnapshot(
      collectionRef as CollectionReference<Read>,
      documentId
    )
    return parseDocumentSnapshot<Read>(docSnapshot)
  }

  /**
   * ドキュメントを更新する
   * @param collectionRef 書き込み対象の CollectionReference
   * @param documentId 更新するドキュメントのID
   * @param data 更新する部分的なデータ
   */
  public static async update<Write extends BaseDocument>(
    collectionRef: CollectionReference,
    documentId: string,
    data: Partial<Write>
  ): Promise<void> {
    const docRef = doc(collectionRef, documentId)
    await this.handleFirestoreOperation(
      updateDoc(docRef, { ...data, updatedAt: serverTimestamp() }),
      'Failed to update document',
      documentId
    )
  }

  /**
   * ドキュメントを物理削除する
   * @param collectionRef 対象の CollectionReference
   * @param documentId 削除するドキュメントのID
   */
  public static async hardDelete(
    collectionRef: CollectionReference,
    documentId: string
  ): Promise<void> {
    const docRef = doc(collectionRef, documentId)
    await this.handleFirestoreOperation(
      deleteDoc(docRef),
      'Failed to hard delete document',
      documentId
    )
  }

  /**
   * ドキュメントを論理削除する（isActive を false に設定）
   * @param collectionRef 対象の CollectionReference
   * @param documentId 削除するドキュメントのID
   * @param updateFields オプションで追加の更新フィールドを指定
   */
  public static async softDelete<Write extends BaseDocument>(
    collectionRef: CollectionReference,
    documentId: string,
    updateFields?: Partial<Write>
  ): Promise<void> {
    await this.update(collectionRef, documentId, {
      ...updateFields,
      isActive: false,
      deletedAt: serverTimestamp(),
    } as Partial<Write & SoftDeleteAdditionalField>)
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
   */
  public static async getFirstMatch<Read extends BaseDocumentRead>(
    collectionRef: CollectionReference,
    field: keyof Read,
    value: any
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
