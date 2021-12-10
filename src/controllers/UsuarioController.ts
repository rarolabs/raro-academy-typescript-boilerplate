import { Inject, Service } from "typedi";
import { Request, Response } from "express";
import { IUsuarioService } from "../@types/services/IUsuarioService";
import { UsuarioNaoEncontrado } from "../@types/errors/UsuarioNaoEncontrado";
import { UsuarioOuSenhaInvalidos } from "../@types/errors/UsuarioOuSenhaInvalidos";
import { EmailInvalido } from "../@types/errors/EmailInvalido";

@Service('UsuarioController')
export class UsuarioController {
  constructor(
    @Inject('UsuarioService') private usuarioService: IUsuarioService) {}

  async get(request: Request, response: Response) {
    try {
      const usuario = await this.usuarioService.buscarUsuario(Number(request.params.id));
      response.status(200).send(usuario);
    } catch (err) {
      throw new Error(err);
    }
  }

  async autenticar(request: Request, response: Response) {
    try {
      const token = await this.usuarioService.autenticarUsuario(request.body);
      response.status(200).send(token);
    } catch (err) {
      if (err instanceof UsuarioOuSenhaInvalidos) {
        response.status(422).send("Usuario ou senha não encontrados");
        return;
      }
      throw new Error(err);
    }
  }

  async create(request: Request, response: Response) {
    try {
      const usuario = await this.usuarioService.criarUsuario(request.body);
      response.status(201).send(usuario);
    } catch (err) {
      if (err instanceof EmailInvalido) {
        response.status(422).send("Email inválido");
        return;
      }
      throw new Error(err);
    }
  }

  async update(request: Request, response: Response) {
    try {
      await this.usuarioService.atualizarUsuario(Number(request.params.id), request.body);
      response.status(204).send();
    } catch (err) {
      throw new Error(err);
    }
  }

  async remove(request: Request, response: Response) {
    try{
      await this.usuarioService.removerUsuario(Number(request.params.id));
      response.status(204).send();
    } catch (err) {
      if (err instanceof UsuarioNaoEncontrado) {
        response.status(422).send("Usuário não encontrado");
        return;
      } 
      throw new Error(err); 
    } 
  }
}
