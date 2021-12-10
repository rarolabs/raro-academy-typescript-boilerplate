import { Usuario } from "../models/UsuarioEntity";
import { UpdateResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export interface IUsuarioRepository {
  save(usuario: Usuario): Promise<Usuario>;
  findByEmail(email: string): Promise<Usuario>;
  findById(id: number): Promise<Usuario>;
  update(id: number, usuario: QueryDeepPartialEntity<Usuario>): Promise<UpdateResult>;
}
