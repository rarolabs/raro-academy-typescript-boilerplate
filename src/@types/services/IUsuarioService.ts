import { LoginDTO } from "../dto/loginDto";
import { UsuarioAtualizarDTO, UsuarioDTO, UsuarioRetornoDTO } from "../dto/UsuarioDto";

export interface IUsuarioService {
  autenticarUsuario(login: LoginDTO): Promise<string>;
  buscarUsuario(id: number): Promise<UsuarioRetornoDTO>;
  criarUsuario(usuarioDto: UsuarioDTO): Promise<UsuarioRetornoDTO>;
  atualizarUsuario(id: number, usuarioAtualizarDto: UsuarioAtualizarDTO): Promise<void>;
  removerUsuario(id: number): Promise<void>;
}