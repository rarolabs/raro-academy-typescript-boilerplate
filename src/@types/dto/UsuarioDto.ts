import { TipoUsuario } from "../../models/TipoUsuarioEntity";
import { TipoUsuarioRetornoDTO } from "./TipoUsuarioDto";

export interface UsuarioDTO {
    tipoUsuarioId: number;
    id: number;
    login: string;
    email: string;
    senha: string;
  }
  
export interface UsuarioRetornoDTO {
    login: string;
    email: string;
}

export interface UsuarioAtualizarDTO {
    login?: string;
    senha?: string;
    tipoUsuarioId?: number;
}

export interface UsuarioAtualizarBancoDTO {
    login?: string;
    hashSenha?: string;
    tipoUsuario?: TipoUsuario
}

export interface UsuarioLogadoDTO {
  login: string;
  email: string;
  tipoUsuario: TipoUsuarioRetornoDTO
}