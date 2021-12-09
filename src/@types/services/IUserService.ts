import { UserDTO } from "../dto/UserDto";
import { Usuario } from "../../models/UsuarioEntity";

export interface IUserService {
  listar(): Promise<Usuario[]>;
  buscar(id: number): Promise<Usuario>;
  criar(usuarioDto: UserDTO): Promise<Usuario>;
  atualizar(id: number, usuarioDto: UserDTO): Promise<void>;
  remover(id: number): Promise<void>;
}
