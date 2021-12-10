import { BaseError } from "./BaseError";

export class UsuarioOuSenhaInvalidos extends Error implements BaseError {
  public name: string;
  constructor() {
    super('Usuário ou senha inválidos');
    this.name = 'UsuarioOuSenhaInvalidos';
  }
}