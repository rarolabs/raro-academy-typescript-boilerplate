import { UserDTO } from "../dto/UserDto";
import { User } from "../../models/UserEntity";

export interface IUserService {
  listar(): Promise<User[]>;
  buscar(id: number): Promise<User>;
  criar(usuarioDto: UserDTO): Promise<User>;
  atualizar(id: number, usuarioDto: UserDTO): Promise<void>;
  remover(id: number): Promise<void>;
}
