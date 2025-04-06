import { useState, useCallback } from 'react'
import { storageManager } from '../firebase/storage/storageManager'
import { FileExtension } from '../constants/file-constants'

interface UseStorageServiceReturn {
  uploadFile: (
    path: string,
    id: string,
    file: File,
    options?: {
      format?: FileExtension
      maxSizeMB?: number
    }
  ) => Promise<string>
  uploadFiles: (
    path: string,
    id: string,
    startIndex: number,
    files: File[]
  ) => Promise<string[]>
  getFileUrl: (fileId: string) => Promise<string>
  deleteFile: (fileId: string) => Promise<void>
  progress: number
  error: string | null
}

export const useStorageService = (): UseStorageServiceReturn => {
  const [progress, setProgress] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = useCallback(
    (
      path: string,
      id: string,
      file: File,
      options?: { format?: FileExtension; maxSizeMB?: number }
    ) => {
      return storageManager.uploadFile(path, id, file, options)
    },
    []
  )

  const uploadFiles = useCallback(
    async (path: string, id: string, startIndex: number, files: File[]) => {
      setError(null)
      setProgress(0)
      try {
        // progress の管理を個別ファイル毎に行う場合、アップロード処理内で更新する必要があります
        const urls = await storageManager.uploadFiles(
          path,
          id,
          startIndex,
          files
        )
        return urls
      } catch (err: any) {
        setError(err.message)
        throw err
      }
    },
    []
  )

  const getFileUrl = useCallback(async (fileId: string) => {
    setError(null)
    try {
      const url = await storageManager.getFileUrl(fileId)
      return url
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const deleteFile = useCallback(async (fileId: string) => {
    setError(null)
    try {
      await storageManager.deleteFile(fileId)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  return {
    uploadFile,
    uploadFiles,
    getFileUrl,
    deleteFile,
    progress,
    error,
  }
}
