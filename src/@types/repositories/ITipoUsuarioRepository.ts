import { TipoUsuarioDTO, TipoUsuarioRetornoDTO } from '../dto/TipoUsuarioDto';
import { TipoUsuario } from '../../models/TipoUsuarioEntity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpdateResult } from 'typeorm';

export interface ITipoUsuarioRepository {
  findAllTipoUsuarios(): Promise<TipoUsuarioRetornoDTO[]>;
  findTipoUsuarioById(id: number): Promise<TipoUsuario>;
  saveTipoUsuario(TipoUsuarioDto: TipoUsuarioDTO): Promise<TipoUsuario>;
  update(idTipoUsuario: number, partialEntity: QueryDeepPartialEntity<TipoUsuario>): Promise<UpdateResult>;
  remove(entities: TipoUsuario | TipoUsuario[]): Promise<TipoUsuario[]>;
  findTipoUsuarioWithUsuario(idTipoUsuario: number): Promise<TipoUsuario>;
}
