import { Firestore, runTransaction, Transaction } from 'firebase/firestore'
import FirestoreService from './firestore-service'

class TransactionManager {
  constructor(private firestore: Firestore) {}

  // repositories に Transaction をセットする（FirestoreService 側で実装を用意する必要あり）
  setTransactionToRepositories(
    transaction: Transaction,
    repositories: FirestoreService<any, any>[]
  ): void {
    repositories.forEach((repository) => {
      if (typeof repository.setTransaction === 'function') {
        repository.setTransaction(transaction)
      }
    })
  }

  clearRepositoriesTransaction(
    repositories: FirestoreService<any, any>[]
  ): void {
    repositories.forEach((repository) => {
      if (typeof repository.clearTransaction === 'function') {
        repository.clearTransaction()
      }
    })
  }

  /**
   * runInTransaction を使ってトランザクション処理を実行します。
   * コールバック内でトランザクションを利用した処理が実行され、
   * コールバック終了後に自動的にトランザクションのコミット（またはエラー時はロールバック）が行われます。
   *
   * @param callback トランザクション処理を記述した非同期関数。引数として Transaction を受け取れます。
   * @param repositories 対象のリポジトリ群。リポジトリは内部で setTransaction/clearTransaction メソッドを実装しておく。
   */
  async runInTransaction(
    callback: (transaction: Transaction) => Promise<void>,
    repositories: FirestoreService<any, any>[]
  ): Promise<void> {
    return await runTransaction(this.firestore, async (transaction) => {
      this.setTransactionToRepositories(transaction, repositories)
      try {
        await callback(transaction)
      } finally {
        this.clearRepositoriesTransaction(repositories)
      }
    })
  }
}

export default TransactionManager
