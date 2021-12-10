import { Campeonato } from "models/CampeonatoEntity";
import { UpdateResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export interface ICampeonatoRespository {
    save(campeonato: Campeonato): Promise<Campeonato>;
    findBySlug(slugFind: string): Promise<Campeonato>;
    findById(id: number): Promise<Campeonato>;
    update(id: number, partida: QueryDeepPartialEntity<Campeonato>): Promise<UpdateResult>;
}