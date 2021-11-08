import { UserDTO } from "../dto/UserDto";
import { User } from "../../models/UserEntity";

export interface IUserRepository {
  find(): Promise<User[]>;
  findOne(id: number): Promise<User>;
  save(userDto: UserDTO): Promise<User>;
  remove(entities: User | User[]): Promise<User[]>;
}
