import { Campeonato } from "../models/CampeonatoEntity";
import { Endereco } from "../models/EnderecoEntity";
import {
  AlterarUsuarioDTO,
  AutenticaUsuarioDTO,
  RetornoAutenticacao,
  UsuarioCriadoDTO,
  UsuarioDTO
} from "../@types/dtos/usuarioDto";

export interface IUsuarioService {
  criar(dadosUsuario: UsuarioDTO, endereco: Endereco): Promise<UsuarioCriadoDTO>;
  adicionarCampeonato(usuarioId: number, campeonato: Campeonato): Promise<void>;
  autenticar(dadosUsuario: AutenticaUsuarioDTO): Promise<RetornoAutenticacao>;
  alterar(usuarioId: number, usuarioDTO: AlterarUsuarioDTO): Promise<void>;
  alterarSenha(usuarioid: number, senhaAntiga: string, novaSenha: string): Promise<void>;
  inativar(usuarioId: number): Promise<void>
}
