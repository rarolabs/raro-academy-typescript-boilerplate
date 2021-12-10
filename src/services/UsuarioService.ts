import { IUsuarioRepository } from "../@types/repositories/IUsuarioRepository";
import { UsuarioAtualizarBancoDTO, UsuarioAtualizarDTO, UsuarioDTO, UsuarioLogadoDTO } from "../@types/dto/UsuarioDto";
import { Inject, Service } from "typedi";
import { IUsuarioService } from "../@types/services/IUsuarioService";
import { UsuarioNaoEncontrado } from "../@types/errors/UsuarioNaoEncontrado";
import { ITipoUsuarioRepository } from "../@types/repositories/ITipoUsuarioRepository";
import { Usuario } from "../models/UsuarioEntity";
import { validarEmail } from "../helpers/ValidarEmail";
import { EmailInvalido } from "../@types/errors/EmailInvalido";
import { hashSenha } from "../helpers/HashSenha";
import { LoginDTO } from "../@types/dto/loginDTO";
import { UsuarioOuSenhaInvalidos } from "../@types/errors/UsuarioOuSenhaInvalidos";
import { ITokenService } from "../@types/services/ITokenService";

@Service('UsuarioService')
export class UsuarioService implements IUsuarioService {
    constructor(
      @Inject('UsuarioRepository') private usuarioRepository: IUsuarioRepository,
      @Inject('TipoUsuarioRepository') private tipoUsuarioRepository: ITipoUsuarioRepository,
      @Inject('TokenService') private tokenService: ITokenService
      ) {}
  
    async buscarUsuario(id: number) {
      const usuario = await this.usuarioRepository.findUsuarioById(id);
      if (!usuario) {
        return;
      }
      return this.gerarUsuarioRetorno(usuario); 
    }

    async autenticarUsuario(login: LoginDTO): Promise<string> {
      const usuario = await this.usuarioRepository.findByLoginComTipo(login.login);
      if (!usuario) {
        throw new UsuarioOuSenhaInvalidos();
      }
      if (usuario.hashSenha === hashSenha(login.senha)) {
        const usuarioToken = this.gerarUsuarioLogado(usuario);
        return this.tokenService.gerarToken(usuarioToken);
      }
      throw new UsuarioOuSenhaInvalidos();
    }
  
    async criarUsuario(usuarioDto: UsuarioDTO) {
      const tipoUsuario = await this.tipoUsuarioRepository.findTipoUsuarioById(usuarioDto.tipoUsuarioId);
      const usuario = new Usuario();
      usuario.login = usuarioDto.login;

    if (!validarEmail(usuarioDto.email)) {
      throw new EmailInvalido();
    }
      usuario.email = usuarioDto.email;  
      usuario.hashSenha = hashSenha(usuarioDto.senha);
      usuario.tipoUsuario = tipoUsuario;
      
      const usuarioCriado = await this.usuarioRepository.saveUsuario(usuario);
      return this.gerarUsuarioRetorno(usuarioCriado);
    } 
  
    async atualizarUsuario(id: number, usuarioAtualizarDto: UsuarioAtualizarDTO) {

      const usuarioAtualizar: UsuarioAtualizarBancoDTO = {
        login: usuarioAtualizarDto.login,
        hashSenha: hashSenha(usuarioAtualizarDto.senha),
        tipoUsuario: usuarioAtualizarDto.tipoUsuarioId ? await this.tipoUsuarioRepository.findTipoUsuarioById(usuarioAtualizarDto.tipoUsuarioId) : undefined
      }

      await this.usuarioRepository.updateUsuario(usuarioAtualizar, id);
    }
  
    async removerUsuario(id: number) {
      const removerUsuario = await this.usuarioRepository.findUsuarioById(id);
      if (!removerUsuario) {
        throw new UsuarioNaoEncontrado();
      }
  
      await this.usuarioRepository.remove(removerUsuario);
    }

    private gerarUsuarioRetorno(usuario: Usuario) {
      return {
        login: usuario.login,
        email: usuario.email,
      }
    }

    private gerarUsuarioLogado(usuario: Usuario): UsuarioLogadoDTO {
      return {
        login: usuario.login,
        email: usuario.email,
        tipoUsuario: {
          nivelAcesso: usuario.tipoUsuario.nivelAcesso,
          nome: usuario.tipoUsuario.nome
        }
      }
    }
  }
