import { HttpClient } from "../../@types/infra/http/HttpClient";
import { Request } from "../../@types/infra/http/Request";
import { Response } from "../../@types/infra/http/Response";
import fetch from 'node-fetch';

export class NodeFetchHttpClient implements HttpClient {
  async get<T = never, R = Response<T>>(url: string): Promise<R> {
    const response = await fetch(url);
    const data = await response.json() as T;

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: null
    } as unknown as R;
  }

  delete<T = never, R = Response<T>>(url: string, config?: Request<T>): Promise<R> {
    throw new Error("Method not implemented.");
  }

  head<T = never, R = Response<T>>(url: string, config?: Request<T>): Promise<R> {
    throw new Error("Method not implemented.");
  }

  options<T = never, R = Response<T>>(url: string, config?: Request<T>): Promise<R> {
    throw new Error("Method not implemented.");
  }

  post<T = never, R = Response<T>>(url: string, data?: T, config?: Request<T>): Promise<R> {
    throw new Error("Method not implemented.");
  }

  put<T = never, R = Response<T>>(url: string, data?: T, config?: Request<T>): Promise<R> {
    throw new Error("Method not implemented.");
  }

  patch<T = never, R = Response<T>>(url: string, data?: T, config?: Request<T>): Promise<R> {
    throw new Error("Method not implemented.");
  }
}
