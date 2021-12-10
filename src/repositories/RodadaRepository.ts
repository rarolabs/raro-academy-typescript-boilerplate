import { EntityRepository, Repository } from "typeorm";
import { Rodada } from "../models/RodadaEntity";
import { IRodadaRepository } from "./IRodadaRepository";

@EntityRepository(Rodada)
export class RodadaRepository extends Repository<Rodada> implements IRodadaRepository {
    findBySlug(slugFind: string): Promise<Rodada> {
        return this.findOne({ where: { slug: slugFind } });
    }

    findByNumeroRodada(numeroRodada: number): Promise<Rodada> {
        return this.findOne({
            relations: ['campeonato'],
            where: { rodada: numeroRodada }
        });
    }
    
}