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
  private _collectionManager: CollectionManager

  constructor(
    firestore: Firestore,
    private collectionPathComposition: string | string[]
  ) {
    this._collectionManager = new CollectionManager(firestore)
  }

  // ======================================================================
  // Abstract Methods
  // ======================================================================

  /**
   * 不要な情報を除外し、必要なデータがあるかの確認をした書き込みデータを返します。
   * サブクラスで実装してください。
   * @param data 書き込むデータ
   */
  protected abstract filterCreateData(data: Write): Document

  protected abstract filterUpdateData(data: Partial<Write>): Partial<Document>

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
    const formatData = this.filterCreateData(data) as Document & {
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
    const filterData = this.filterUpdateData(data)
    const formatData = this.removeUndefined(filterData)
    return { ...formatData, updatedAt: serverTimestamp() }
  }

  // ======================================================================
  // Collection Reference
  // ======================================================================

  /**
   * parentDocumentIds は、コレクション間に挟む親ドキュメントIDの配列です。
   * @param parentDocumentIds
   * @returns 対象コレクションの参照
   */
  public getCollectionRef(
    parentDocumentIds: string[] = []
  ): CollectionReference<DocumentData> {
    return this._collectionManager.getCollectionRef(
      this.collectionPathComposition,
      parentDocumentIds
    )
  }

  public getDocumentRefWithAutoId(parentDocumentIds: string[] = []) {
    return doc(this.getCollectionRef(parentDocumentIds))
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
    parentDocumentIds: string[] = []
  ): Promise<DocumentReference<Document>> {
    console.log('called create')
    const collectionRef = this.getCollectionRef(parentDocumentIds)
    return await CRUDHandler.create<Document>(
      collectionRef,
      this.organizeCreateData(data)
    )
  }

  async createWithId(
    data: Write,
    documentId: string,
    parentDocumentIds: string[] = [],
    options?: SetOptions
  ): Promise<CollectionReference<DocumentData, DocumentData>> {
    console.log('called createWithId')
    const collectionRef = this.getCollectionRef(parentDocumentIds)
    await CRUDHandler.createWithId(
      collectionRef,
      documentId,
      this.organizeCreateData(data),
      options
    )
    return collectionRef
  }

  protected async readAsDocumentSnapshot(
    documentId: string,
    parentDocumentIds: string[] = []
  ): Promise<DocumentSnapshot<Read>> {
    const collectionRef = this.getCollectionRef(
      parentDocumentIds
    ) as CollectionReference<Read>
    return CRUDHandler.readAsDocumentSnapshot<Read>(collectionRef, documentId)
  }

  async read(
    documentId: string,
    parentDocumentIds: string[] = []
  ): Promise<Read | null> {
    console.log('called read')
    const collectionRef = this.getCollectionRef(parentDocumentIds)
    return CRUDHandler.read<Read>(collectionRef, documentId)
  }

  async update(
    data: Partial<Write>,
    documentId: string,
    parentDocumentIds: string[] = []
  ): Promise<CollectionReference<DocumentData, DocumentData>> {
    console.log('called update')
    const collectionRef = this.getCollectionRef(parentDocumentIds)
    CRUDHandler.update(collectionRef, documentId, this.organizeUpdateData(data))
    return collectionRef
  }

  async hardDelete(
    documentId: string,
    parentDocumentIds: string[] = []
  ): Promise<CollectionReference<DocumentData, DocumentData>> {
    console.log('called hard delete')
    const collectionRef = this.getCollectionRef(parentDocumentIds)
    await CRUDHandler.delete(collectionRef, documentId)
    return collectionRef
  }

  async softDelete(
    documentId: string,
    parentDocumentIds: string[] = [],
    updateFields: Partial<Write> = {}
  ): Promise<CollectionReference<DocumentData, DocumentData>> {
    console.log('called soft delete')
    const collectionRef = this.getCollectionRef(parentDocumentIds)
    const data = {
      isActive: false,
      deletedAt: serverTimestamp(),
      ...updateFields,
    }
    await CRUDHandler.update(
      collectionRef,
      documentId,
      this.organizeUpdateData(data)
    )
    return collectionRef
  }

  async getAllAsQuerySnapshot(
    parentDocumentIds: string[] = [],
    queryConstraints: QueryConstraint[] = []
  ): Promise<QuerySnapshot<Read>> {
    const collectionRef = this.getCollectionRef(
      parentDocumentIds
    ) as CollectionReference<Read>
    return CRUDHandler.getAllAsQuerySnapshot<Read>(
      collectionRef,
      ...queryConstraints
    )
  }

  async getAll(
    parentDocumentIds: string[] = [],
    queryConstraints: QueryConstraint[] = []
  ): Promise<Read[]> {
    console.log('called get all')
    const collectionRef = this.getCollectionRef(parentDocumentIds)
    return CRUDHandler.getAll<Read>(collectionRef, ...queryConstraints)
  }

  async getFirstMatch(
    field: keyof Read,
    value: any,
    parentDocumentIds: string[] = []
  ): Promise<Read | null> {
    console.log('called get first match')
    const collectionRef = this.getCollectionRef(parentDocumentIds)
    return CRUDHandler.getFirstMatch<Read>(collectionRef, field, value)
  }

  async getAllWithPagination(
    parentDocumentIds: string[] = [],
    startAfterDoc?: DocumentSnapshot<Read>,
    limitCount?: number,
    ...queryConstraints: QueryConstraint[]
  ): Promise<Read[]> {
    const collectionRef = this.getCollectionRef(parentDocumentIds)
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
    documentId: string,
    parentDocumentIds: string[] = [],
    callbackId?: string
  ): { callbackId: string; unsubscribe: Unsubscribe } {
    const collectionRef = this.getCollectionRef(
      parentDocumentIds
    ) as CollectionReference<Read>
    return this.callbacksHandler.addCallback(
      collectionRef,
      documentId,
      callback,
      callbackId
    )
  }

  addReadCallback(
    callback: (data: Read | null) => void,
    documentId: string,
    parentDocumentIds: string[] = [],
    callbackId?: string
  ): { callbackId: string; unsubscribe: Unsubscribe } {
    return this.addCallback(
      (snapshot) => callback(parseDocumentSnapshot(snapshot)),
      documentId,
      parentDocumentIds,
      callbackId
    )
  }

  removeCallback(
    callbackId: string,
    documentId: string,
    parentDocumentIds: string[] = []
  ): void {
    const collectionRef = this.getCollectionRef(
      parentDocumentIds
    ) as CollectionReference<Read>
    this.callbacksHandler.removeCallback(collectionRef, documentId, callbackId)
  }

  addCollectionCallback(
    callback: (snapshot: QuerySnapshot<Read, DocumentData>) => void,
    parentDocumentIds: string[] = [],
    callbackId?: string
  ): { callbackId: string; unsubscribe: Unsubscribe } {
    const collectionRef = this.getCollectionRef(
      parentDocumentIds
    ) as CollectionReference<Read>
    return this.callbacksHandler.addCollectionCallback(
      collectionRef,
      callback,
      callbackId
    )
  }

  addReadCollectionCallback(
    callback: (data: Read[]) => void,
    parentDocumentIds: string[] = [],
    callbackId?: string
  ): { callbackId: string; unsubscribe: Unsubscribe } {
    return this.addCollectionCallback(
      (snapshot) => callback(parseQuerySnapshot(snapshot)),
      parentDocumentIds,
      callbackId
    )
  }

  removeCollectionCallback(
    callbackId: string,
    parentDocumentIds: string[] = []
  ): void {
    const collectionRef = this.getCollectionRef(
      parentDocumentIds
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
    documentId: string | null,
    parentDocumentIds: string[] = [],
    batch = this.getBatch('setInBatch()')
  ): CollectionReference<DocumentData, DocumentData> {
    const collectionRef = this.getCollectionRef(parentDocumentIds)
    BatchHandler.set(
      batch,
      this.organizeCreateData(data),
      collectionRef,
      documentId
    )
    return collectionRef
  }

  updateInBatch(
    data: Partial<Write>,
    documentId: string,
    parentDocumentIds: string[] = [],
    batch = this.getBatch('updateInBatch()')
  ): CollectionReference<DocumentData, DocumentData> {
    const collectionRef = this.getCollectionRef(parentDocumentIds)
    BatchHandler.update(
      batch,
      this.organizeUpdateData(data),
      collectionRef,
      documentId
    )
    return collectionRef
  }

  deleteInBatch(
    documentId: string,
    parentDocumentIds: string[] = [],
    batch = this.getBatch('deleteInBatch()')
  ): CollectionReference<DocumentData, DocumentData> {
    const collectionRef = this.getCollectionRef(parentDocumentIds)
    BatchHandler.delete(batch, collectionRef, documentId)
    return collectionRef
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

  setInTransaction(
    data: Write,
    documentId: string | null,
    parentDocumentIds: string[] = [],
    transaction = this.getTransaction('setInTransaction()')
  ): CollectionReference<DocumentData, DocumentData> {
    const collectionRef = this.getCollectionRef(parentDocumentIds)
    TransactionHandler.set(
      transaction,
      this.organizeCreateData(data),
      collectionRef,
      documentId
    )
    return collectionRef
  }

  updateInTransaction(
    data: Partial<Write>,
    documentId: string,
    parentDocumentIds: string[] = [],
    transaction = this.getTransaction('updateInTransaction()')
  ): CollectionReference<DocumentData, DocumentData> {
    const collectionRef = this.getCollectionRef(parentDocumentIds)
    TransactionHandler.update(
      transaction,
      this.organizeUpdateData(data),
      collectionRef,
      documentId
    )
    return collectionRef
  }

  deleteInTransaction(
    documentId: string,
    parentDocumentIds: string[] = [],
    transaction = this.getTransaction('deleteInTransaction()')
  ): CollectionReference<DocumentData, DocumentData> {
    const collectionRef = this.getCollectionRef(parentDocumentIds)
    TransactionHandler.delete(transaction, collectionRef, documentId)
    return collectionRef
  }
}

export default FirestoreService
