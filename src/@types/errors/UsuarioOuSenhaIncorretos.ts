import { BolaoBaseError } from "./BolaoBaseError";

export class UsuarioOuSenhaIncorretos extends Error implements BolaoBaseError {
  public name: string;
  constructor() {
    super('Usuário ou senha incorretos');
    this.name = 'UsuarioOuSenhaIncorretos';
  }
}