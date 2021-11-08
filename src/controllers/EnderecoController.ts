import { Inject, Service } from "typedi";
import {Request, Response} from "express";
import { IEnderecoService } from "../@types/services/IEnderecoService";

@Service('EnderecoController')
export class EnderecoController {

  constructor(@Inject('EnderecoService') private enderecoService: IEnderecoService) {}

  async get(request: Request, response: Response) {
    const endereco = await this.enderecoService.buscaPorCep(request.params.cep);
    response.send(endereco);
  }
}
