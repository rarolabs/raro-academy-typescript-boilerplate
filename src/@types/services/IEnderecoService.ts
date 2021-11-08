import { EnderecoDto } from "../../@types/dto/EnderecoDto";

export interface IEnderecoService {
  buscaPorCep(cep: string): Promise<EnderecoDto>;
}
