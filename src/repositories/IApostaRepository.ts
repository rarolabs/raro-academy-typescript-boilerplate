import { Aposta } from "../models/ApostaEntity";
import { UpdateResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export interface IApostaRepository {
    findbyUsuario(usuarioId: number): Promise<Aposta[]>;
    findbyUsuarioAndPartida(usuarioId: number, partidaId: number): Promise<Aposta>;
    findAll(): Promise<Aposta[]>;
    save(aposta: Aposta): Promise<Aposta>;
    update(id: number, partida: QueryDeepPartialEntity<Aposta>): Promise<UpdateResult>;
}