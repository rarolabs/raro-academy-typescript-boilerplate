import { BaseError } from "./BaseError";

export class CepNaoEncontrado extends Error implements BaseError {
  public name: string;
  constructor() {
    super('CEP não encontrado');
    this.name = 'CepNaoEncontrado';
  }
}
