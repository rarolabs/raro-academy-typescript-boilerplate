import { Rodada } from "../models/RodadaEntity";
import { UpdateResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export interface IRodadaRepository {
    findBySlug(slug: string): Promise<Rodada>;
    findByNumeroRodada(numeroRodada: number): Promise<Rodada>;
    update(id: number, partida: QueryDeepPartialEntity<Rodada>): Promise<UpdateResult>;
    save(rodada: Rodada[]): Promise<Rodada>;
}