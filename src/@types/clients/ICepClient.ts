import { EnderecoDto } from "../dto/EnderecoDto";

export interface ICepClient {
  buscaEnderecoPorCEP(cep: string): Promise<EnderecoDto>;
}
