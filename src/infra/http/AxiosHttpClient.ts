import axios, { Axios } from "axios";
import { Service } from "typedi";
import { HttpClient } from "./types/HttpClient";

@Service('HttpClient')
export class AxiosHttpClient extends Axios implements HttpClient {
  constructor() {
    super(axios.defaults)
  }
}
