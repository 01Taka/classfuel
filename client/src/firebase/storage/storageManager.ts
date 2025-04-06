import {
  FirebaseStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { storage } from '../firebase'
import { FileExtension } from '../../constants/file-constants'

export class StorageManager {
  constructor(private storage: FirebaseStorage = storage) {}

  /**
   * 複数ファイルのアップロードを行い、アップロード成功したファイルのID一覧を返す
   */
  async uploadFiles(
    path: string,
    id: string,
    startIndex: number,
    files: File[]
  ): Promise<string[]> {
    const uploadPromises = files.map((file, index) => {
      const fileId = `${id}_${startIndex + index}`
      return this.uploadFile(path, fileId, file).catch((error) => {
        console.error(`ファイル ${index} のアップロードに失敗しました:`, error)
        return null
      })
    })

    const results = await Promise.all(uploadPromises)
    return results.filter((url): url is string => url !== null)
  }

  private getFileId(path: string, id: string): string {
    return `${path}_${id}`
  }

  /**
   * 単一ファイルのアップロード処理
   */
  async uploadFile(
    path: string,
    id: string,
    file: File,
    options: { format?: FileExtension; maxSizeMB?: number } = {}
  ): Promise<string> {
    const { format = this.getFileExtension(file.type), maxSizeMB = 5 } = options

    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(
        `ファイルサイズが大きすぎます。最大 ${maxSizeMB}MB です。`
      )
    }

    const fileExtension = this.getFileExtension(file.type)
    if (format && fileExtension !== format) {
      throw new Error(`ファイル形式が一致しません。指定形式: ${format}`)
    }

    const storageRef = ref(this.storage, path)
    const fileRef = ref(storageRef, `${id}.${format}`)

    await new Promise<void>((resolve, reject) => {
      const uploadTask = uploadBytesResumable(fileRef, file)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress.toFixed(2)}% done`)
        },
        (error) => {
          console.error('アップロード中にエラーが発生しました:', error)
          reject(error)
        },
        () => {
          console.log('アップロードが完了しました')
          resolve()
        }
      )
    })

    return this.getFileId(path, id)
  }

  async uploadData(
    path: string,
    id: string,
    data: Blob | Uint8Array | ArrayBuffer | File
  ) {
    const storageRef = ref(this.storage, path)
    const fileRef = ref(storageRef, `${id}`)

    await new Promise<void>((resolve, reject) => {
      const uploadTask = uploadBytesResumable(fileRef, data)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress.toFixed(2)}% done`)
        },
        (error) => {
          console.error('アップロード中にエラーが発生しました:', error)
          reject(error)
        },
        () => {
          console.log('アップロードが完了しました')
          resolve()
        }
      )
    })

    return this.getFileId(path, id)
  }

  /**
   * 単一ファイルのダウンロードURLを取得する
   */
  async getFileUrl(fileId: string): Promise<string> {
    if (!fileId) return ''
    const adjustedFileId = fileId.replace(/_/g, '/')
    const fileRef = ref(this.storage, adjustedFileId)
    try {
      const url = await getDownloadURL(fileRef)
      return url
    } catch (error) {
      console.error('ファイルの取得に失敗しました:', error)
      throw error
    }
  }

  /**
   * 複数ファイルのダウンロードURLを取得する
   */
  async getFileUrls(fileIds: string[]): Promise<string[]> {
    return Promise.all(fileIds.map((id) => this.getFileUrl(id)))
  }

  /**
   * ファイルの削除を行う
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      const fileRef = ref(this.storage, fileId)
      await deleteObject(fileRef)
      console.log('ファイルが削除されました')
    } catch (error) {
      console.error('ファイルの削除に失敗しました:', error)
      throw error
    }
  }

  /**
   * URLまたはMIMEタイプからファイル拡張子を抽出する
   */
  getFileExtension(urlOrType: string): FileExtension | '' {
    const trimmed = urlOrType.split('?')[0].split('#')[0]
    const decoded = decodeURIComponent(trimmed)
    const parts = decoded.split('.')
    const extension = (
      parts.length > 1 ? (parts.pop()?.toLowerCase() ?? '') : ''
    ) as FileExtension

    return Object.values(FileExtension).includes(extension) ? extension : ''
  }
}

export const storageManager = new StorageManager(storage)
