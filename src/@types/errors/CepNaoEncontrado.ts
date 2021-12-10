import { BolaoBaseError } from "./BolaoBaseError";

export class CepNaoEncontrado extends Error implements BolaoBaseError {
  public name: string;
  constructor() {
    super('CEP não encontrado');
    this.name = 'CepNaoEncontrado';
  }
}
