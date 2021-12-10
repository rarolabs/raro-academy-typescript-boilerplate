import { Endereco } from "../models/EnderecoEntity";

export interface IEnderecoRepository {
    findbyCep(cepFind: string): Promise<Endereco>;
    save(endereco: Endereco): Promise<Endereco>;
}