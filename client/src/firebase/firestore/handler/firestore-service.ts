import {
  Firestore,
  CollectionReference,
  DocumentData,
  DocumentSnapshot,
  Transaction,
  QueryConstraint,
  QuerySnapshot,
  DocumentReference,
  Unsubscribe,
  WriteBatch,
  FieldValue,
  serverTimestamp,
  SetOptions,
  doc,
} from 'firebase/firestore'
import BatchHandler from './batch-handler'
import TransactionHandler from './transaction-handler'
import CollectionManager from './collection-manager'
import { parseDocumentSnapshot, parseQuerySnapshot } from '../snapshotUtils'
import { CRUDHandler } from './crud-dandler'
import { CallbacksHandler } from './callbacks-handler'
import { getAuth } from 'firebase/auth'
import {
  BaseDocumentRead,
  BaseDocumentWrite,
  BaseDocument,
} from '../../../types/firebase/firestore-document-types'

abstract class FirestoreService<
  Read extends BaseDocumentRead,
  Write extends BaseDocumentWrite,
  Document extends BaseDocument = Write,
> {
  private _callbacksHandler?: CallbacksHandler<Read>

  constructor(
    private firestore: Firestore,
    private collectionPathComposition: string | string[]
  ) {}

  // ======================================================================
  // Abstract Methods
  // ======================================================================

  /**
   * 不要な情報を除外した書き込みデータを返します。
   * サブクラスで実装してください。
   * @param data 書き込むデータ
   */
  protected abstract filterWriteData<T extends Write | Partial<Write>>(
    data: T
  ): T extends Write ? Document : Partial<Document>

  private getUid(): string {
    const uid = getAuth().currentUser?.uid
    if (!uid) {
      throw new Error('Firestore Service においてUIDが取得できませんでした。')
    }
    return uid
  }

  private checkRequiredProperties(properties: Record<string, any>) {
    const missingProperties = Object.keys(properties).filter(
      (key) => properties[key] === undefined
    )
    if (missingProperties.length > 0) {
      throw new Error(
        `必要なプロパティが足りていません: ${missingProperties.join(', ')}`
      )
    }
  }

  /**
   * 作成前の前処理を行う
   * @param data 作成するデータ
   * @param options オプション（setInvalid なら isActive を false に）
   * @returns 前処理後のデータ（createdAt と isActive を付与）
   */
  private addSystemFields<Write>(
    data: Write
  ): Write & { createdAt: FieldValue; isActive: boolean } {
    return {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
    }
  }

  private organizeCreateData(data: Write): Document & { createdById: string } {
    const formatData = this.filterWriteData(data) as Document & {
      createdById: string
    }
    formatData.createdById = this.getUid()
    this.checkRequiredProperties(formatData)
    return this.addSystemFields(formatData)
  }

  private removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined)
    ) as Partial<T>
  }

  private organizeUpdateData(data: Partial<Write>): Partial<Document> {
    const filterData = this.filterWriteData(data)
    const formatData = this.removeUndefined(filterData)
    return { ...formatData, updatedAt: serverTimestamp() }
  }

  // ======================================================================
  // Collection Reference
  // ======================================================================

  /**
   * コレクションまたはドキュメントを動的に取得。
   * @param path コレクション間に挟む親ドキュメントIDの配列
   * @param refType trueでDocumentRefを返す
   */
  public getReference(
    path: string[],
    refType: 'collection'
  ): CollectionReference<DocumentData>
  public getReference(
    path: string[],
    refType: 'doc'
  ): DocumentReference<DocumentData>
  public getReference(
    path: string[],
    refType: 'doc' | 'collection'
  ): CollectionReference<DocumentData> | DocumentReference<DocumentData> {
    return CollectionManager.getReference(
      this.firestore,
      this.collectionPathComposition,
      path ?? [],
      refType
    )
  }

  public getDocumentRefWithAutoId(collectionPath: string[] = []) {
    return doc(this.getReference(collectionPath, 'collection'))
  }

  // ======================================================================
  // Lazy Initialization: Batch / Transaction Handlers
  // ======================================================================

  private get callbacksHandler(): CallbacksHandler<Read> {
    if (!this._callbacksHandler) {
      this._callbacksHandler = new CallbacksHandler<Read>()
    }
    return this._callbacksHandler
  }

  // ======================================================================
  // CRUD Methods
  // ======================================================================

  async create(
    data: Write,
    collectionPath: string[] = []
  ): Promise<DocumentReference<Document>> {
    console.log('called create')
    const collectionRef = this.getReference(collectionPath, 'collection')
    return await CRUDHandler.create<Document>(
      collectionRef,
      this.organizeCreateData(data)
    )
  }

  async createWithId(
    data: Write,
    documentPath: string[],
    options?: SetOptions
  ): Promise<DocumentReference<DocumentData, DocumentData>> {
    console.log('called createWithId')
    const docRef = this.getReference(documentPath, 'doc')
    await CRUDHandler.createWithId(
      docRef,
      this.organizeCreateData(data),
      options
    )
    return docRef
  }

  protected async readAsDocumentSnapshot(
    documentPath: string[]
  ): Promise<DocumentSnapshot<Read>> {
    const docRef = this.getReference(
      documentPath,
      'doc'
    ) as DocumentReference<Read>
    return CRUDHandler.readAsDocumentSnapshot<Read>(docRef)
  }

  async read(documentPath: string[]): Promise<Read | null> {
    console.error('called read')
    const collectionRef = this.getReference(documentPath, 'doc')
    return CRUDHandler.read<Read>(collectionRef)
  }

  async update(
    data: Partial<Write>,
    documentPath: string[]
  ): Promise<DocumentReference<DocumentData, DocumentData>> {
    console.log('called update')
    const docRef = this.getReference(documentPath, 'doc')
    CRUDHandler.update(docRef, this.organizeUpdateData(data))
    return docRef
  }

  async hardDelete(
    documentPath: string[]
  ): Promise<DocumentReference<DocumentData, DocumentData>> {
    console.log('called hard delete')
    const docRef = this.getReference(documentPath, 'doc')
    await CRUDHandler.delete(docRef)
    return docRef
  }

  async softDelete(
    documentPath: string[],
    updateFields: Partial<Write> = {}
  ): Promise<DocumentReference<DocumentData, DocumentData>> {
    console.log('called soft delete')
    const docRef = this.getReference(documentPath, 'doc')
    const data = {
      isActive: false,
      deletedAt: serverTimestamp(),
      ...updateFields,
    }
    await CRUDHandler.update(docRef, this.organizeUpdateData(data))
    return docRef
  }

  async getAllAsQuerySnapshot(
    collectionPath: string[] = [],
    queryConstraints: QueryConstraint[] = []
  ): Promise<QuerySnapshot<Read>> {
    const collectionRef = this.getReference(
      collectionPath,
      'collection'
    ) as CollectionReference<Read>
    return CRUDHandler.getAllAsQuerySnapshot<Read>(
      collectionRef,
      ...queryConstraints
    )
  }

  async getAll(
    collectionPath: string[] = [],
    queryConstraints: QueryConstraint[] = []
  ): Promise<Read[]> {
    console.log('called get all')
    const collectionRef = this.getReference(collectionPath, 'collection')
    return CRUDHandler.getAll<Read>(collectionRef, ...queryConstraints)
  }

  async getFirstMatch(
    field: keyof Read,
    value: any,
    collectionPath: string[] = []
  ): Promise<Read | null> {
    console.log('called get first match')
    const collectionRef = this.getReference(collectionPath, 'collection')
    return CRUDHandler.getFirstMatch<Read>(collectionRef, field, value)
  }

  async getAllWithPagination(
    collectionPath: string[] = [],
    startAfterDoc?: DocumentSnapshot<Read>,
    limitCount?: number,
    ...queryConstraints: QueryConstraint[]
  ): Promise<Read[]> {
    const collectionRef = this.getReference(collectionPath, 'collection')
    return CRUDHandler.getAllWithPagination<Read>(
      collectionRef,
      startAfterDoc,
      limitCount,
      ...queryConstraints
    )
  }

  // ======================================================================
  // Callbacks Methods
  // ======================================================================

  addCallback(
    callback: (snapshot: DocumentSnapshot<Read, DocumentData>) => void,
    documentPath: string[],
    callbackId?: string
  ): { callbackId: string; unsubscribe: Unsubscribe } {
    const docRef = this.getReference(
      documentPath,
      'doc'
    ) as DocumentReference<Read>
    return this.callbacksHandler.addCallback(docRef, callback, callbackId)
  }

  addReadCallback(
    callback: (data: Read | null) => void,
    documentPath: string[],
    callbackId?: string
  ): { callbackId: string; unsubscribe: Unsubscribe } {
    return this.addCallback(
      (snapshot) => callback(parseDocumentSnapshot(snapshot)),
      documentPath,
      callbackId
    )
  }

  removeCallback(callbackId: string, documentPath: string[]): void {
    const docRef = this.getReference(
      documentPath,
      'doc'
    ) as DocumentReference<Read>
    this.callbacksHandler.removeCallback(docRef, callbackId)
  }

  addCollectionCallback(
    callback: (snapshot: QuerySnapshot<Read, DocumentData>) => void,
    collectionPath: string[] = [],
    callbackId?: string
  ): { callbackId: string; unsubscribe: Unsubscribe } {
    const collectionRef = this.getReference(
      collectionPath,
      'collection'
    ) as CollectionReference<Read>
    return this.callbacksHandler.addCollectionCallback(
      collectionRef,
      callback,
      callbackId
    )
  }

  addReadCollectionCallback(
    callback: (data: Read[]) => void,
    collectionPath: string[] = [],
    callbackId?: string
  ): { callbackId: string; unsubscribe: Unsubscribe } {
    return this.addCollectionCallback(
      (snapshot) => callback(parseQuerySnapshot(snapshot)),
      collectionPath,
      callbackId
    )
  }

  removeCollectionCallback(
    callbackId: string,
    collectionPath: string[] = []
  ): void {
    const collectionRef = this.getReference(
      collectionPath,
      'collection'
    ) as CollectionReference<Read>
    this.callbacksHandler.removeCollectionCallback(collectionRef, callbackId)
  }

  // ======================================================================
  // BatchHandler Methods
  // ======================================================================

  private batch: WriteBatch | null = null

  setBatch(batch: WriteBatch) {
    this.batch = batch
  }

  clearBatch() {
    this.batch = null
  }

  private getBatch(methodName: string): WriteBatch {
    if (!this.batch) {
      throw new Error(
        `No active batch. Call setBatch() before using ${methodName}.`
      )
    }
    return this.batch
  }

  setInBatch(
    data: Write,
    documentPath: string[],
    batch = this.getBatch('setInBatch()')
  ): DocumentReference<DocumentData, DocumentData> {
    const docRef = this.getReference(documentPath, 'doc')
    BatchHandler.set(batch, this.organizeCreateData(data), docRef)
    return docRef
  }

  updateInBatch(
    data: Partial<Write>,
    documentPath: string[],
    batch = this.getBatch('updateInBatch()')
  ): DocumentReference<DocumentData, DocumentData> {
    const docRef = this.getReference(documentPath, 'doc')
    BatchHandler.update(batch, this.organizeUpdateData(data), docRef)
    return docRef
  }

  deleteInBatch(
    documentPath: string[],
    batch = this.getBatch('deleteInBatch()')
  ): DocumentReference<DocumentData, DocumentData> {
    const docRef = this.getReference(documentPath, 'doc')
    BatchHandler.delete(batch, docRef)
    return docRef
  }

  // ======================================================================
  // TransactionHandler Methods
  // ======================================================================

  protected transaction: Transaction | null = null

  setTransaction(transaction: Transaction): void {
    this.transaction = transaction
  }

  clearTransaction(): void {
    this.transaction = null
  }

  private getTransaction(methodName: string): Transaction {
    if (!this.transaction) {
      throw new Error(
        `No active transaction. Call setTransaction() before using ${methodName}.`
      )
    }
    return this.transaction
  }

  async getInTransaction(
    documentPath: string[],
    transaction = this.getTransaction('getInTransaction()')
  ): Promise<Read | null> {
    const docRef = this.getReference(documentPath, 'doc')
    const result = await TransactionHandler.get(transaction, docRef)
    return parseDocumentSnapshot<Read>(result)
  }

  setInTransaction(
    data: Write,
    documentPath: string[],
    transaction = this.getTransaction('setInTransaction()')
  ): DocumentReference<DocumentData, DocumentData> {
    const docRef = this.getReference(documentPath, 'doc')
    TransactionHandler.set(transaction, this.organizeCreateData(data), docRef)
    return docRef
  }

  updateInTransaction(
    data: Partial<Write>,
    documentPath: string[],
    transaction = this.getTransaction('updateInTransaction()')
  ): DocumentReference<DocumentData, DocumentData> {
    const docRef = this.getReference(documentPath, 'doc')
    TransactionHandler.update(
      transaction,
      this.organizeUpdateData(data),
      docRef
    )
    return docRef
  }

  deleteInTransaction(
    documentPath: string[],
    transaction = this.getTransaction('deleteInTransaction()')
  ): DocumentReference<DocumentData, DocumentData> {
    const docRef = this.getReference(documentPath, 'doc')
    TransactionHandler.delete(transaction, docRef)
    return docRef
  }
}

export default FirestoreService
