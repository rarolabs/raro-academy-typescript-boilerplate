export interface Response<T = never>  {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}