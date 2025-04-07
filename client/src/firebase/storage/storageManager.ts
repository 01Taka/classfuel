import {
  FirebaseStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  StorageError,
  UploadTaskSnapshot,
} from 'firebase/storage'
import { storage } from '../firebase'

type UploadOptions = {
  onStateChanged?: (data: {
    snapshot: UploadTaskSnapshot
    progress: number
  }) => void
  onFailedUpload?: (error: StorageError) => void
  onCompletedUpload?: () => void
}

type UploadData = {
  path: string | string[]
  data: Blob | Uint8Array | ArrayBuffer | File
}

export class StorageManager {
  constructor(private storage: FirebaseStorage) {}

  private normalizePath(path: string | string[]): string {
    return Array.isArray(path) ? path.join('/') : path
  }

  private encodePath(path: string): string {
    return path.replace(/\//g, '_')
  }

  private decodePath(fileId: string): string {
    return fileId.replace(/_/g, '/')
  }

  async upload(
    path: string | string[],
    data: Blob | Uint8Array | ArrayBuffer | File,
    options?: UploadOptions
  ): Promise<string> {
    const storagePath = this.normalizePath(path)
    const fileRef = ref(this.storage, storagePath)

    await new Promise<void>((resolve, reject) => {
      const uploadTask = uploadBytesResumable(fileRef, data)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = snapshot.bytesTransferred / snapshot.totalBytes
          options?.onStateChanged?.({ snapshot, progress })
        },
        (error) => {
          console.error('アップロード中にエラー:', error)
          options?.onFailedUpload?.(error)
          reject(error)
        },
        () => {
          console.log('アップロード完了:', storagePath)
          options?.onCompletedUpload?.()
          resolve()
        }
      )
    })

    return this.encodePath(storagePath)
  }

  async multipleUpload(
    files: UploadData[],
    options?: UploadOptions
  ): Promise<string[]> {
    return Promise.all(
      files.map(({ path, data }) => this.upload(path, data, options))
    )
  }

  async getFileUrl(fileId: string): Promise<string> {
    if (!fileId) return ''

    try {
      const fileRef = ref(this.storage, this.decodePath(fileId))
      return await getDownloadURL(fileRef)
    } catch (error) {
      console.error('ダウンロードURL取得失敗:', error)
      throw error
    }
  }

  async getFileUrls(fileIds: string[]): Promise<string[]> {
    return Promise.all(fileIds.map((id) => this.getFileUrl(id)))
  }

  async delete(fileId: string): Promise<void> {
    try {
      const fileRef = ref(this.storage, this.decodePath(fileId))
      await deleteObject(fileRef)
      console.log('ファイル削除成功:', fileId)
    } catch (error) {
      console.error('ファイル削除失敗:', error)
      throw error
    }
  }
}

export const storageManager = new StorageManager(storage)
