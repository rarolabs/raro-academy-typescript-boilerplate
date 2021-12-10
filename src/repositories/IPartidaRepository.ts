import { Partida } from "../models/PartidaEntity";
import { UpdateResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export interface IPartidaRepository {
    findbySlug(slugFind: string): Promise<Partida>;
    findbyRodadaId(numeroRodada: number): Promise<Partida[]>;
    update(id: number, partida: QueryDeepPartialEntity<Partida>): Promise<UpdateResult>;
}