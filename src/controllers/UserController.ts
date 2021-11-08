import { Inject, Service } from "typedi";
import {Request, Response} from "express";
import { IUserService } from "../@types/services/IUserService";

@Service('UserController')
export class UserController {

  constructor(@Inject('UserService') private  userService: IUserService) {}

  async list(request: Request, response: Response) {
    const users = await this.userService.listar();
    response.send(users);
  }

  async get(request: Request, response: Response) {
    const user = await this.userService.buscar(Number(request.params.id));
    response.send(user);
  }

  async create(request: Request, response: Response) {
    const user = await this.userService.criar(request.body);
    response.send(user);
  }

  async update(request: Request, response: Response) {
    const user = await this.userService.atualizar(Number(request.params.id), request.body);
    response.send(user);
  }

  async remove(request: Request, response: Response) {
    await this.userService.remover(Number(request.params.id));
    response.send();
  }
}
