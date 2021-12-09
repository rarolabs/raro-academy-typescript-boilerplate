import { UserDTO } from "../dto/UserDto";
import { Usuario } from "../../models/UsuarioEntity";

export interface IUserRepository {
  find(): Promise<Usuario[]>;
  findOne(id: number): Promise<Usuario>;
  save(userDto: UserDTO): Promise<Usuario>;
  remove(entities: Usuario | Usuario[]): Promise<Usuario[]>;
}
