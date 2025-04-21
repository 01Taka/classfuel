import {
  Firestore,
  collection,
  doc,
  CollectionReference,
  DocumentReference,
  DocumentData,
} from 'firebase/firestore'

class CollectionManager {
  /**
   * コレクション名とドキュメントIDから CollectionReference または DocumentReference を取得
   * @param firestore - Firestore インスタンス
   * @param collectionNames - コレクション名（単一 or 複数）
   * @param collectionPath - 各コレクション間に挟むドキュメントID
   * @param refType - 'collection' ならコレクション参照、'doc' ならドキュメント参照を返す
   */
  static getReference(
    firestore: Firestore,
    collectionNames: string | string[],
    collectionPath: string[],
    refType: 'collection' | 'doc'
  ): CollectionReference<DocumentData> | DocumentReference<DocumentData> {
    const collections = Array.isArray(collectionNames)
      ? collectionNames
      : [collectionNames]
    const includeDocumentsId = refType === 'doc'

    const path = this.composePath(
      collections,
      collectionPath,
      includeDocumentsId
    )

    return refType === 'collection'
      ? collection(firestore, path)
      : doc(firestore, path)
  }

  /**
   * コレクションとドキュメントIDの配列を合成してパスを作成
   * @param collectionNames - 例: ['users', 'posts']
   * @param collectionPath - 例: ['userId', 'postId']
   * @param includeDocumentsId - 最後にドキュメントIDを含めるか
   */
  static composePath(
    collectionNames: string[],
    collectionPath: string[],
    includeDocumentsId: boolean
  ): string {
    const expectedDocCount =
      collectionNames.length - (includeDocumentsId ? 0 : 1)

    if (collectionPath.length !== expectedDocCount) {
      throw new Error(
        `Expected ${expectedDocCount} document IDs, but got ${collectionPath.length}.`
      )
    }

    const parts: string[] = []

    collectionNames.forEach((col, i) => {
      if (i > 0) {
        parts.push(collectionPath[i - 1])
      }
      parts.push(col)
    })

    if (includeDocumentsId) {
      parts.push(collectionPath[collectionPath.length - 1])
    }

    return parts.join('/')
  }
}

export default CollectionManager
