import { HttpClient } from "../@types/infra/http/HttpClient";
import { EnderecoDTO } from "../@types/dtos/api-cep/EnderecoDTO";
import { CepNaoEncontrado } from "../@types/errors/CepNaoEncontrado";
import * as dotenv from "dotenv";

dotenv.config()
export class EnderecoClient {
  private API_CEP = `${process.env.BASE_API_CEP}/[CEP]/json/`;
  constructor(private readonly httpClient: HttpClient) {}

  async buscaEnderecoPorCep(cep: string) {
    const url = this.API_CEP.replace('[CEP]', cep);
    const response = await this.httpClient.get<EnderecoDTO>(url);
    const endereco = response.data;
    if (!endereco.cep) {
      throw new CepNaoEncontrado();
    }

    return response.data;
  }
}