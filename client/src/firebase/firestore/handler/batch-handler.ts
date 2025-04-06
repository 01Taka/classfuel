import {
  CollectionReference,
  doc,
  DocumentData,
  FieldValue,
  Firestore,
  serverTimestamp,
  writeBatch,
  WriteBatch,
} from 'firebase/firestore'
import { BaseDocument } from '../../../types/firebase/firestore-document-types'

class BatchHandler<Write extends BaseDocument> {
  // コレクションごとにアクティブなバッチ操作を管理するマップ（キーは collectionRef.path）
  private batches: Map<string, WriteBatch> = new Map()

  constructor(private firestore: Firestore) {}

  /**
   * 指定されたコレクションに対してバッチ操作を開始します。
   * すでに同じコレクションでバッチが開始されている場合はエラーをスローします。
   * @param collectionRef 対象のコレクションRef
   */
  startBatch(collectionRef: CollectionReference<DocumentData>): void {
    const key = collectionRef.path
    if (this.batches.has(key)) {
      throw new Error(
        'Batch already in progress for this collection. Commit or cancel the current batch first.'
      )
    }
    this.batches.set(key, writeBatch(this.firestore))
  }

  /**
   * 指定されたコレクションのバッチ操作をキャンセルします。
   * @param collectionRef 対象のコレクションRef
   */
  cancelBatch(collectionRef: CollectionReference<DocumentData>): void {
    const key = collectionRef.path
    this.batches.delete(key)
  }

  /**
   * 指定されたコレクションのバッチ操作をコミットします。
   * @param collectionRef 対象のコレクションRef
   */
  async commitBatch(
    collectionRef: CollectionReference<DocumentData>
  ): Promise<void> {
    const key = collectionRef.path
    const batch = this.batches.get(key)
    if (batch) {
      await batch.commit()
      this.batches.delete(key)
    }
  }

  /**
   * アクティブなバッチ操作を取得します。
   * 存在しない場合はエラーをスローします。
   * @param collectionRef 対象のコレクションRef
   */
  private getActiveBatch(
    collectionRef: CollectionReference<DocumentData>
  ): WriteBatch {
    const key = collectionRef.path
    const batch = this.batches.get(key)
    if (!batch) {
      throw new Error(
        'No active batch operation for this collection. Please call startBatch() first.'
      )
    }
    return batch
  }

  /**
   * 作成前の前処理を行います。
   * @param data 作成するデータ
   * @param options オプション（setInvalid が true なら isActive を false に）
   * @returns 前処理済みのデータ（createdAt と isActive を付与）
   */
  private writePreprocessing(
    data: Write,
    options: { setInvalid?: boolean } = {}
  ): Write & { createdAt: FieldValue; isActive: boolean } {
    return {
      ...data,
      createdAt: serverTimestamp(),
      isActive: !options.setInvalid,
    }
  }

  /**
   * 指定されたコレクションRefとドキュメントIDに対してドキュメントを作成（セット）します。
   * @param collectionRef 対象のコレクションRef
   * @param documentId 作成するドキュメントのID
   * @param data 作成するデータ
   */
  set(
    data: Write,
    collectionRef: CollectionReference,
    documentId: string | null
  ): void {
    const batch = this.getActiveBatch(collectionRef)
    const docRef = documentId
      ? doc(collectionRef, documentId)
      : doc(collectionRef)
    batch.set(docRef, this.writePreprocessing(data))
  }

  /**
   * 指定されたコレクションRefとドキュメントIDに対してドキュメントを更新します。
   * @param collectionRef 対象のコレクションRef
   * @param documentId 更新するドキュメントのID
   * @param data 更新する部分データ
   */
  update(
    data: Partial<Write>,
    collectionRef: CollectionReference,
    documentId: string
  ): void {
    const batch = this.getActiveBatch(collectionRef)
    const docRef = doc(collectionRef, documentId)
    batch.update(docRef, data as Write)
  }

  /**
   * 指定されたコレクションRefとドキュメントIDに対してドキュメントを削除します。
   * @param collectionRef 対象のコレクションRef
   * @param documentId 削除するドキュメントのID
   */
  delete(collectionRef: CollectionReference, documentId: string): void {
    const batch = this.getActiveBatch(collectionRef)
    const docRef = doc(collectionRef, documentId)
    batch.delete(docRef)
  }
}

export default BatchHandler
