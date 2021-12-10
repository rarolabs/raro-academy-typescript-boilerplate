import { EntityRepository, Repository } from "typeorm";
import { Campeonato } from "../models/CampeonatoEntity";
import { ICampeonatoRespository } from "./ICampeonatoRepository";

@EntityRepository(Campeonato)
export class CampeonatoRepository extends Repository<Campeonato> implements ICampeonatoRespository{
    findBySlug(slugFind: string): Promise<Campeonato> {
        return this.findOne({
            where: { slug: slugFind }
        });
    }

    findById(id: number) {
        return this.findOne(id);
    }
}