import { BolaoBaseError } from "./BolaoBaseError";

export class UsuarioJaCadastrado extends Error implements BolaoBaseError {
  public static CODE = 'ER_DUP_ENTRY';
  
  public name: string;
  constructor() {
    super('Usuário ou senha incorretos');
    this.name = 'UsuarioOuSenhaIncorretos';
  }
}
