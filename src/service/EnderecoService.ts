import { EnderecoClient } from "../clients/EnderecoClient";
import { EnderecoDTO } from "../@types/dtos/api-cep/EnderecoDTO";
import { Endereco } from "../models/EnderecoEntity";
import { IEnderecoRepository } from "../repositories/IEnderecoRepository";
import { IEnderecoService } from "./IEnderecoService";

export class EnderecoService implements IEnderecoService {
    constructor(
        private enderecoRepository: IEnderecoRepository,
        private enderecoClient: EnderecoClient
        ) {}

    async buscarCep(cep: string, numero: string): Promise<Endereco> {
        try {
            const enderecoAPI = await this.enderecoClient.buscaEnderecoPorCep(cep);
            const enderecoParaBD = this.factoryEndereco(enderecoAPI, numero);

            return await this.enderecoRepository.save(enderecoParaBD);
        } catch (error) {
            throw new Error(`Houve um erro ao buscar CEP. Motivo: ${error.message}`);
        }
    }

    private factoryEndereco(enderecoDTO: EnderecoDTO, numero: string): Endereco {
        const endereco = new Endereco();
        endereco.bairro = enderecoDTO.bairro;
        endereco.cep = enderecoDTO.cep.replace("-", "");
        endereco.logradouro = enderecoDTO.logradouro;
        endereco.estado = enderecoDTO.uf;
        endereco.numero = numero;

        return endereco
    }

}