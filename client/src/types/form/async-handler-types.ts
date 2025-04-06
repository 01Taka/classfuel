export type AsyncStatus = "idle" | "loading" | "error" | "success";

export interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: Error | null;
  errorMessage: string;
}

export interface UpdateArrayFieldArgs<T extends Record<string, any>, K = any> {
  fieldName: keyof T,
  index: number | "push",
  data?: K,
  deleteItem?: boolean
}