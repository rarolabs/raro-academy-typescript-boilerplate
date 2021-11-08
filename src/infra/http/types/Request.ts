export interface Request<T = never> {
  url?: string;
  baseURL?: string;
  headers?: Record<string, string>;
  params?: never;
  data?: T;
  timeout?: number;
  timeoutErrorMessage?: string;
  withCredentials?: boolean;
}
