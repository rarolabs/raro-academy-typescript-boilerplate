import { UsuarioAtualizarBancoDTO } from "../dto/UsuarioDto";
import { Usuario } from "../../models/UsuarioEntity";
import { UpdateResult } from "typeorm";

export interface IUsuarioRepository {
  findByLogin(login: string): Promise<Usuario>;
  findByLoginComTipo(login: string): Promise<Usuario>
  findUsuarioById(id: number): Promise<Usuario>;
  saveUsuario(usuario: Usuario): Promise<Usuario>;
  updateUsuario(usuarioAtualizarBancoDto: UsuarioAtualizarBancoDTO, id: number): Promise<UpdateResult>;
  remove(entities: Usuario | Usuario[]): Promise<Usuario[]>;
}