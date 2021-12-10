import { HttpClient } from "../../@types/infra/http/HttpClient";
import axios, { Axios } from "axios";

export class AxiosHttpClient extends Axios implements HttpClient {
  constructor() {
    super(axios.defaults)
  }
}
