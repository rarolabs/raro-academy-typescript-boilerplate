import { EntityRepository, Repository } from "typeorm";
import { IEnderecoRepository } from "./IEnderecoRepository";
import { Endereco } from "../models/EnderecoEntity";

@EntityRepository(Endereco)
export class EnderecoRepository extends Repository<Endereco> implements IEnderecoRepository {
    findbyCep(cepFind: string): Promise<Endereco> {
        return this.findOne({ where: { cep: cepFind } });
    }
}