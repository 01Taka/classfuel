import { Timestamp } from 'firebase/firestore'
import { FirestoreSpecialOperations } from '../../../constants/firestore-constants'

type FirestoreOperationResult<T> = {
  [FirestoreSpecialOperations.Increment]: number
  [FirestoreSpecialOperations.ServerTimestamp]: Timestamp
  [FirestoreSpecialOperations.DeleteField]: null
  [FirestoreSpecialOperations.ArrayUnion]: T[]
}

export type FirestoreOperationToType<
  Op extends FirestoreSpecialOperations,
  T = unknown,
> = FirestoreOperationResult<T>[Op]
