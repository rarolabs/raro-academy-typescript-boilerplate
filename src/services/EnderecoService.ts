import { Inject, Service } from "typedi";
import { IEnderecoService } from "../@types/services/IEnderecoService";
import { EnderecoDto } from "../@types/dto/EnderecoDto";
import { ICepClient } from "../@types/clients/ICepClient";

@Service('EnderecoService')
export class EnderecoService implements IEnderecoService {
  constructor(@Inject('CepClient') private cepClient: ICepClient) {}

  buscaPorCep(cep: string): Promise<EnderecoDto> {
    return this.cepClient.buscaEnderecoPorCEP(cep);
  }
}
