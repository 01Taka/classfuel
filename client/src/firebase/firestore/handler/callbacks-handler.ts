import {
  DocumentSnapshot,
  QuerySnapshot,
  doc,
  onSnapshot,
  CollectionReference,
  Unsubscribe,
} from 'firebase/firestore'
import { nanoid } from 'nanoid'
import { BaseDocumentRead } from '../../../types/firebase/firestore-document-types'

// 個別ドキュメント用のコールバック
export interface Callback<Read extends BaseDocumentRead> {
  unsubscribe: Unsubscribe
  func: Map<string, (snapshot: DocumentSnapshot<Read>) => void>
}

// コレクション全体用のコールバック
export interface CollectionCallback<Read extends BaseDocumentRead> {
  unsubscribe: Unsubscribe
  func: Map<string, (snapshot: QuerySnapshot<Read>) => void>
}

export class CallbacksHandler<Read extends BaseDocumentRead> {
  // ドキュメントごとのコールバックは「コレクションのパス/documentId」の形のキーで管理
  private callbacks: Map<string, Callback<Read>> = new Map()
  // コレクション全体のコールバックは「コレクションのパス」をキーに管理
  private collectionCallbacks: Map<string, CollectionCallback<Read>> = new Map()

  constructor() {}

  /**
   * 個別ドキュメントのコールバックエントリを作成し、リスナーを登録する
   * @param collectionRef 対象のコレクションRef
   * @param documentId 対象のドキュメントID
   */
  private createDocumentCallbackEntry(
    collectionRef: CollectionReference<Read>,
    documentId: string
  ): Callback<Read> {
    const key = `${collectionRef.path}/${documentId}`
    const docRef = doc(collectionRef, documentId)
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      this.callbacks.get(key)?.func.forEach((cb) => cb(docSnapshot))
    })
    const entry: Callback<Read> = { func: new Map(), unsubscribe }
    this.callbacks.set(key, entry)
    return entry
  }

  /**
   * 個別ドキュメントのコールバックを追加する
   * @param collectionRef 対象のコレクションRef
   * @param documentId ドキュメントID
   * @param callback コールバック関数
   * @param callbackId （任意）コールバックID。未指定なら自動生成
   * @param overwrite 上書きフラグ（trueの場合、同じIDのコールバックを強制上書き）
   * @returns 使用したコールバックID
   */
  addCallback(
    collectionRef: CollectionReference<Read>,
    documentId: string,
    callback: (snapshot: DocumentSnapshot<Read>) => void,
    callbackId?: string,
    overwrite = false
  ): { callbackId: string; unsubscribe: Unsubscribe } {
    const key = `${collectionRef.path}/${documentId}`
    const cbId = callbackId ?? nanoid()
    let callbackEntry =
      this.callbacks.get(key) ||
      this.createDocumentCallbackEntry(collectionRef, documentId)

    if (overwrite) {
      callbackEntry.func.set(cbId, callback)
    } else {
      if (!callbackEntry.func.has(cbId)) {
        callbackEntry.func.set(cbId, callback)
      }
    }

    return {
      callbackId: cbId,
      unsubscribe: callbackEntry.unsubscribe,
    }
  }

  /**
   * 個別ドキュメントのコールバックを削除する
   * @param collectionRef 対象のコレクションRef
   * @param documentId ドキュメントID
   * @param callbackId 削除するコールバックID
   */
  removeCallback(
    collectionRef: CollectionReference<Read>,
    documentId: string,
    callbackId: string
  ): void {
    const key = `${collectionRef.path}/${documentId}`
    const callbackEntry = this.callbacks.get(key)
    if (callbackEntry) {
      callbackEntry.func.delete(callbackId)
      if (callbackEntry.func.size === 0) {
        callbackEntry.unsubscribe?.()
        this.callbacks.delete(key)
      }
    }
  }

  /**
   * コレクション全体のコールバックを追加する
   * @param collectionRef 対象のコレクションRef
   * @param callback コールバック関数
   * @param callbackId （任意）コールバックID。未指定なら自動生成
   * @param overwrite 上書きフラグ
   * @returns 使用したコールバックID
   */
  addCollectionCallback(
    collectionRef: CollectionReference<Read>,
    callback: (snapshot: QuerySnapshot<Read>) => void,
    callbackId?: string,
    overwrite = false
  ): { callbackId: string; unsubscribe: Unsubscribe } {
    const key = collectionRef.path
    let colCallback = this.collectionCallbacks.get(key)

    if (!colCallback) {
      const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
        colCallback!.func.forEach((cb) => cb(querySnapshot))
      })
      colCallback = { func: new Map(), unsubscribe }
      this.collectionCallbacks.set(key, colCallback)
    }
    const cbId = callbackId ?? nanoid()
    if (overwrite) {
      colCallback.func.set(cbId, callback)
    } else {
      if (!colCallback.func.has(cbId)) {
        colCallback.func.set(cbId, callback)
      }
    }
    return {
      callbackId: cbId,
      unsubscribe: colCallback.unsubscribe,
    }
  }

  /**
   * コレクション全体のコールバックを削除する
   * @param collectionRef 対象のコレクションRef
   * @param callbackId 削除するコールバックID
   */
  removeCollectionCallback(
    collectionRef: CollectionReference<Read>,
    callbackId: string
  ): void {
    const key = collectionRef.path
    const colCallback = this.collectionCallbacks.get(key)
    if (colCallback) {
      colCallback.func.delete(callbackId)
      if (colCallback.func.size === 0) {
        colCallback.unsubscribe?.()
        this.collectionCallbacks.delete(key)
      }
    }
  }
}
