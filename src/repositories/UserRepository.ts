import { Usuario } from "../models/UsuarioEntity";
import { EntityRepository, Repository } from "typeorm";
import { IUserRepository } from "../@types/repositories/IUserRepository";

@EntityRepository(Usuario)
export class UserRepository extends Repository<Usuario> implements IUserRepository{
}
