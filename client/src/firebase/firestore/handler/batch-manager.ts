import { Firestore, writeBatch, WriteBatch } from 'firebase/firestore'
import FirestoreService from './firestore-service'

class BatchManager {
  private batch: WriteBatch | null = null

  constructor(private firestore: Firestore) {}

  setBatchToRepositories(
    batch: WriteBatch,
    repositories: FirestoreService<any, any>[]
  ): void {
    repositories.forEach((repository) => {
      repository.setBatch(batch)
    })
  }

  clearRepositoriesBatch(repositories: FirestoreService<any, any>[]): void {
    repositories.forEach((repository) => {
      repository.clearBatch()
    })
  }

  async runInBatch(
    callback: () => Promise<void>,
    repositories: FirestoreService<any, any>[]
  ): Promise<void> {
    const batch = this.startBatch()
    this.setBatchToRepositories(batch, repositories)
    try {
      await callback()
      this.clearRepositoriesBatch(repositories)
      await this.commitBatch()
    } catch (error) {
      this.clearRepositoriesBatch(repositories)
      this.cancelBatch()
      throw error // 呼び出し元でエラーハンドリングできるように投げ直す
    }
  }

  startBatch(): WriteBatch {
    if (this.batch) {
      throw new Error('A batch is already in progress.')
    }

    const newBatch = writeBatch(this.firestore)
    this.batch = newBatch
    return newBatch
  }

  getBatch(): WriteBatch {
    if (!this.batch) {
      throw new Error('No active batch. Call startBatch() first.')
    }
    return this.batch
  }

  async commitBatch(): Promise<void> {
    if (!this.batch) {
      throw new Error('No active batch to commit.')
    }
    await this.batch.commit()
    this.batch = null
  }

  cancelBatch(): void {
    if (!this.batch) return
    this.batch = null
  }
}

export default BatchManager
