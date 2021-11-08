import { User } from "../models/UserEntity";
import { EntityRepository, Repository } from "typeorm";
import { IUserRepository } from "../@types/repositories/IUserRepository";

@EntityRepository(User)
export class UserRepository extends Repository<User> implements IUserRepository{
}
