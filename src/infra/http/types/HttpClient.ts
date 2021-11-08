import { Request } from "./Request";
import { Response } from "./Response";

export interface HttpClient {
  get<T = never, R = Response<T>>(url: string, config?: Request<T>): Promise<R>;
  delete<T = never, R = Response<T>>(url: string, config?: Request<T>): Promise<R>;
  head<T = never, R = Response<T>>(url: string, config?: Request<T>): Promise<R>;
  options<T = never, R = Response<T>>(url: string, config?: Request<T>): Promise<R>;
  post<T = never, R = Response<T>>(url: string, data?: T, config?: Request<T>): Promise<R>;
  put<T = never, R = Response<T>>(url: string, data?: T, config?: Request<T>): Promise<R>;
  patch<T = never, R = Response<T>>(url: string, data?: T, config?: Request<T>): Promise<R>;
}