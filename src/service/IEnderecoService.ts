import { Endereco } from "models/EnderecoEntity";

export interface IEnderecoService {
    buscarCep(cep: string, numero: string): Promise<Endereco>;
}