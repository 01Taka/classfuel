import { DocumentSnapshot, QuerySnapshot } from 'firebase/firestore'
import { BaseDocumentRead } from '../../types/firebase/firestore-document-types'

/**
 * ドキュメントスナップショットからデータを抽出して整形するユーティリティ関数
 * @param docSnapshot ドキュメントスナップショット
 * @returns 整形されたデータ
 */
export const parseDocumentSnapshot = <Read extends BaseDocumentRead>(
  docSnapshot: DocumentSnapshot
): Read | null => {
  if (!docSnapshot.exists()) return null

  const data = docSnapshot.data() as Read

  if (!data.isActive) return null // 論理削除されたデータは無効

  // 基本プロパティの設定
  data.docId = docSnapshot.id
  data.path = docSnapshot.ref.path
  data.parentId = docSnapshot.ref.parent.parent?.id ?? ''

  return data
}

/**
 * クエリスナップショットをパースする関数
 * @param querySnapshot クエリスナップショット
 * @returns 整形されたデータの配列
 */
export const parseQuerySnapshot = <Read extends BaseDocumentRead>(
  querySnapshot: QuerySnapshot
): Read[] => {
  return querySnapshot.docs
    .map((doc) => parseDocumentSnapshot(doc)) // 各ドキュメントをパース
    .filter((doc): doc is Read => doc !== null) // null を除外
}
