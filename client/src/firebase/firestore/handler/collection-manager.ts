import {
  Firestore,
  CollectionReference,
  collection,
  DocumentData,
} from 'firebase/firestore'

class CollectionManager {
  // キャッシュした CollectionReference を管理する
  private cachedCollections: Record<string, CollectionReference<DocumentData>> =
    {}

  constructor(private firestore: Firestore) {}

  /**
   * 文字列または文字列配列を必ず文字列配列に変換する
   */
  private normalizeToArray(input: string | string[]): string[] {
    return Array.isArray(input) ? input : [input]
  }

  /**
   * キャッシュに存在すれば返し、なければ新たに作成してキャッシュする
   */
  private getOrCreateCollection(
    path: string
  ): CollectionReference<DocumentData> {
    return (this.cachedCollections[path] ??= collection(this.firestore, path))
  }

  /**
   * コレクション名と間に挟むドキュメントIDの配列からコレクションパスを合成し、
   * CollectionReference を取得する
   * @param collectionPath - コレクション名またはその配列（例: "users" または ["users", "posts"]）
   * @param documentIds - ドキュメントIDの配列（コレクション間に挟む）
   *                     例: ["userId"] なら "users/userId/posts" のように合成
   */
  public getCollectionRef(
    collectionPath: string | string[],
    documentIds: string[] = []
  ): CollectionReference<DocumentData> {
    const collections = this.normalizeToArray(collectionPath)
    const composedPath = CollectionManager.composeCollectionPath(
      collections,
      documentIds
    )
    return this.getOrCreateCollection(composedPath)
  }

  /**
   * コレクション名の配列とドキュメントIDの配列を使い、
   * Firestore のパス（文字列）を合成する
   *
   * 例:
   *  collectionNames = ['users', 'posts']
   *  documentIds = ['userId']
   *  -> "users/userId/posts"
   *
   * @throws ドキュメントIDの数がコレクション名の数-1と一致しない場合
   */
  public static composeCollectionPath(
    collectionNames: string[],
    documentIds: string[]
  ): string {
    if (documentIds.length !== collectionNames.length - 1) {
      throw new Error(
        `The number of provided document IDs (${documentIds.length}) does not match the expected number (${collectionNames.length - 1}).`
      )
    }

    const pathParts: string[] = []
    collectionNames.forEach((collectionName, index) => {
      if (index > 0) {
        pathParts.push(documentIds[index - 1])
      }
      pathParts.push(collectionName)
    })
    return pathParts.join('/')
  }
}

export default CollectionManager
