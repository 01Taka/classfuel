import {
  DocumentReference,
  DocumentData,
  Unsubscribe,
  SetOptions,
} from 'firebase/firestore'
import {
  BaseDocumentRead,
  BaseDocumentWrite,
  BaseDocument,
} from '../../../types/firebase/firestore-document-types'
import FirestoreService from './firestore-service'

class NamedDocumentService<
  Read extends BaseDocumentRead,
  Write extends BaseDocumentWrite,
  Document extends BaseDocument = Write,
> {
  private readonly docName: string
  private readonly baseService: FirestoreService<Read, Write, Document>

  constructor(
    baseService: FirestoreService<Read, Write, Document>,
    docName: string // 例: "main"
  ) {
    this.baseService = baseService
    this.docName = docName
  }

  private getPath(basePath: string[]): string[] {
    return [...basePath, this.docName]
  }

  async read(basePath: string[]): Promise<Read | null> {
    return this.baseService.read(this.getPath(basePath))
  }

  async update(
    data: Partial<Write>,
    basePath: string[]
  ): Promise<DocumentReference<DocumentData>> {
    return this.baseService.update(data, this.getPath(basePath))
  }

  async create(
    data: Write,
    basePath: string[],
    options?: SetOptions
  ): Promise<DocumentReference<DocumentData>> {
    return this.baseService.createWithId(data, this.getPath(basePath), options)
  }

  async delete(basePath: string[]): Promise<DocumentReference<DocumentData>> {
    return this.baseService.hardDelete(this.getPath(basePath))
  }

  async softDelete(
    basePath: string[],
    updateFields: Partial<Write> = {}
  ): Promise<DocumentReference<DocumentData>> {
    return this.baseService.softDelete(this.getPath(basePath), updateFields)
  }

  addCallback(
    callback: (data: Read | null) => void,
    basePath: string[],
    callbackId?: string
  ): { callbackId: string; unsubscribe: Unsubscribe } {
    return this.baseService.addReadCallback(
      callback,
      this.getPath(basePath),
      callbackId
    )
  }

  removeCallback(callbackId: string, basePath: string[]): void {
    this.baseService.removeCallback(callbackId, this.getPath(basePath))
  }
}

export default NamedDocumentService
