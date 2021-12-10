import * as faker from 'faker';
import { AutenticaUsuarioDTO, RetornoAutenticacao, UsuarioDTO } from "../../@types/dtos/usuarioDto";
import { UsuarioRepository } from "../../repositories/UsuarioRepository";
import { UsuarioService } from "../UsuarioService";
import { Usuario } from "../../models/UsuarioEntity";
import { UsuarioJaCadastrado } from '../../@types/errors/UsuarioJaCadastrado';
import { UsuarioOuSenhaIncorretos } from '../../@types/errors/UsuarioOuSenhaIncorretos';

import * as passwordHelpers from '../../helpers/password';
import * as tokenHelperes from '../../helpers/token';
import { Endereco } from '../../models/EnderecoEntity';
import { Campeonato } from '../../models/CampeonatoEntity';

describe('UsuarioService', () => {
  let usuarioDto: UsuarioDTO;
  let usuarioRepository: UsuarioRepository;
  let usuarioService: UsuarioService;
  let endereco: Endereco;
  let usuarioId: number;
  let usuarioCampeonato: Usuario;
  let campeonato: Campeonato;

  let senha: string;
  let token: string;
  let dadosAutenticacao: AutenticaUsuarioDTO;

  faker.datatype.number(10)
  const oldEnv = process.env;
  beforeEach(() => {
    process.env.CRYPTO_ALGORITHM = 'SHA256';
    process.env.SECRET = faker.datatype.uuid();
    process.env.AUTH_SECRET = faker.datatype.uuid();
  });
  afterEach(() => {
    process.env = oldEnv;
  });

  beforeEach(jest.clearAllMocks);
  beforeEach(() => {
    usuarioDto = {
      nome: faker.name.firstName(),
      email: faker.internet.email(),
      senha: faker.internet.password(),
    };
    usuarioRepository = new UsuarioRepository();
    usuarioService = new UsuarioService(usuarioRepository);
    endereco = new Endereco();
    usuarioCampeonato = new Usuario();
    usuarioCampeonato.nome = faker.name.firstName();
    usuarioCampeonato.email = faker.internet.email();
    usuarioCampeonato.campeonatos = [];

    campeonato = new Campeonato();
    campeonato.nome = faker.lorem.word();
    campeonato.id = faker.datatype.number();


    dadosAutenticacao = {
      email: faker.internet.email(),
      senha
    };
    senha = faker.internet.password();
    token = faker.internet.password();
    jest.spyOn(passwordHelpers, 'getHashSenha').mockReturnValue(senha);
    jest.spyOn(tokenHelperes, 'generateJwtToken').mockReturnValue(token);
  });

  describe('criarUsuario', () => {
    it('deve criar um novo usuário com sucesso', async () => {
      jest.spyOn(usuarioRepository, 'save').mockResolvedValue(new Usuario());
      await usuarioService.criar(usuarioDto, endereco);

      const { senha, ...expectedUsuarioDto } = usuarioDto;
      (expectedUsuarioDto as Usuario).hashSenha = expect.any(String)
      expect(usuarioRepository.save).toHaveBeenCalledWith({...expectedUsuarioDto, endereco});
      expect(usuarioRepository.save).not.toHaveBeenCalledWith(
        expect.objectContaining({ hashSenha: usuarioDto.senha })
      );
      expect(usuarioRepository.save).not.toHaveBeenCalledWith(
        expect.objectContaining({ senha: usuarioDto.senha })
      );
    });

    it('deve lançar erro caso um usuário já cadastrado for cadastrado novamente', async () => {
      const rejectionError = { code: UsuarioJaCadastrado.CODE }
      jest.spyOn(usuarioRepository, 'save').mockRejectedValue(rejectionError);
      await expect(usuarioService.criar(usuarioDto, endereco))
        .rejects
        .toThrow(new UsuarioJaCadastrado());
    });

    it('deve lançar os demais tipos de erros conforme são criados', async () => {
      const rejectionError = new Error('any error thrown');
      jest.spyOn(usuarioRepository, 'save').mockRejectedValue(rejectionError);
      const endereco = new Endereco();
      await expect(usuarioService.criar(usuarioDto, endereco))
        .rejects
        .toThrow(rejectionError);
    });
  });

  describe('autenticar', () => {
    it('deve autenticar um usuario', async () => {
      const usuario = new Usuario();
      usuario.id = faker.datatype.number();
      usuario.nome = faker.name.firstName();
      usuario.email = faker.internet.email();
      usuario.hashSenha = senha;
      usuario.ativo = true;
      jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(usuario);
      const resposta = await usuarioService.autenticar(dadosAutenticacao);

      const respostaEsperada: RetornoAutenticacao = {
        email: usuario.email,
        id: usuario.id,
        nome: usuario.nome,
        token,
        ativo: true
      };

      expect(resposta).toEqual(respostaEsperada);
    });

    it('deve bloquear o login de um usuario inativo', async () => {
      const usuario = new Usuario();
      usuario.ativo = false;
      jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(usuario);
      await expect(usuarioService.autenticar(dadosAutenticacao))
        .rejects
        .toThrow(new UsuarioOuSenhaIncorretos());
    });

    it('deve bloquear o login com usuario incorreto', async () => {
      jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(null);
      await expect(usuarioService.autenticar(dadosAutenticacao))
        .rejects
        .toThrow(new UsuarioOuSenhaIncorretos());
    });

    it('deve bloquear o login com senha incorreta', async () => {
      const usuario = new Usuario();
      usuario.ativo = true;
      usuario.hashSenha = 'senha diferente da utilizada pelo usuário';
      jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(usuario);
      await expect(usuarioService.autenticar(dadosAutenticacao))
        .rejects
        .toThrow(new UsuarioOuSenhaIncorretos());
    });
  });

  describe('alterar', () => {
    it('deve alterar um usuario', async () => {
      jest.spyOn(usuarioRepository, 'update').mockResolvedValue(null);
      jest.spyOn(passwordHelpers, 'getHashSenha');
      const usuarioId = faker.datatype.number();
      const alteracaoDoUsuario = {
        nome: faker.name.firstName(),
        email: faker.internet.email(),
        senha: faker.internet.password(),
        avatarUrl: faker.internet.avatar(),
      };

      await usuarioService.alterar(usuarioId, alteracaoDoUsuario);
      const { senha, ...chamadaEsperada } = alteracaoDoUsuario;
      expect(passwordHelpers.getHashSenha).not.toHaveBeenCalled();
      expect(usuarioRepository.update).toHaveBeenCalledWith(
        usuarioId,
        expect.objectContaining(chamadaEsperada)
      );
    });

    it('deve ignorar os campos vazios', async () => {
      jest.spyOn(usuarioRepository, 'update').mockResolvedValue(null);
      jest.spyOn(passwordHelpers, 'getHashSenha');
      const usuarioId = faker.datatype.number();
      const alteracaoDoUsuario = {
        nome: faker.name.firstName(),
        email: '',
        senha: '',
        avatarUrl: '',
      };

      await usuarioService.alterar(usuarioId, alteracaoDoUsuario);
      expect(passwordHelpers.getHashSenha).not.toHaveBeenCalled();
      expect(usuarioRepository.update).toHaveBeenCalledWith(
        usuarioId,
        { nome: alteracaoDoUsuario.nome }
      );
    });
  });

  describe('alterar senha', () => {
    let usuarioId: number;
    let senhaAntiga: string;
    let novaSenha: string;
    let usuario: Usuario;

    beforeEach(() => {
      usuarioId = faker.datatype.number();
      senhaAntiga = faker.internet.password();
      novaSenha = faker.internet.password();
      usuario = new Usuario();
      usuario.hashSenha = faker.internet.password();
      usuario.ativo = true;
    });

    it('deve alterar a senha do usuario', async () => {
      jest.spyOn(usuarioRepository, 'update').mockResolvedValue(null);
      jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(usuario);
      jest.spyOn(passwordHelpers, 'getHashSenha').mockReturnValue(usuario.hashSenha);

      await usuarioService.alterarSenha(usuarioId, senhaAntiga, novaSenha);
      expect(usuarioRepository.update).toHaveBeenCalledWith(
        usuarioId,
        { hashSenha: expect.any(String) }
      );
    });

    it('deve impedir alteracao se o usuario não for encontrado', async () => {
      jest.spyOn(usuarioRepository, 'update').mockResolvedValue(null);
      jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(null);

      await expect(usuarioService.alterarSenha(usuarioId, senhaAntiga, novaSenha))
        .rejects
        .toThrow(new UsuarioOuSenhaIncorretos());
    });

    it('deve impedir alteracao se a senha antiga estiver incorreta', async () => {
      jest.spyOn(usuarioRepository, 'update').mockResolvedValue(null);
      jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(usuario);
      jest.spyOn(passwordHelpers, 'getHashSenha').mockReturnValue('senha incorreta');

      await expect(usuarioService.alterarSenha(usuarioId, senhaAntiga, novaSenha))
        .rejects
        .toThrow(new UsuarioOuSenhaIncorretos());
    });

    it('deve impedir alteracao se o usuario estiver inativo', async () => {
      usuario.ativo = false;
      jest.spyOn(usuarioRepository, 'update').mockResolvedValue(null);
      jest.spyOn(usuarioRepository, 'findOne').mockResolvedValue(usuario);
      jest.spyOn(passwordHelpers, 'getHashSenha').mockReturnValue(usuario.hashSenha);

      await expect(usuarioService.alterarSenha(usuarioId, senhaAntiga, novaSenha))
        .rejects
        .toThrow(new UsuarioOuSenhaIncorretos());
    });
  });

  describe('inativar', () => {
    it('deve permitir a alteração de um usuario', async () => {
      jest.spyOn(usuarioRepository, 'update').mockResolvedValue(null);
      const usuarioId = faker.datatype.number();
      await usuarioService.inativar(usuarioId);

      expect(usuarioRepository.update).toHaveBeenCalledWith(
        usuarioId,
        { ativo: false }
      );
    });
  });

  describe("adicionarCampeonato", () => {
    it("Deve retornar um erro caso não consiga encontrar o usuário no banco", async () => {
      jest.spyOn(usuarioRepository, "findById").mockRejectedValue(new Error("Não foi possivel buscar dados do usuário no banco"));

      await expect(usuarioService.adicionarCampeonato(usuarioId, campeonato)).rejects.toThrow();
    });
    it("Deve ignorar e retornar vazio caso o usuário já esteja cadastrado no campeonato", async () => {
      usuarioCampeonato.campeonatos = [campeonato];
      jest.spyOn(usuarioRepository, "findById").mockResolvedValue(usuarioCampeonato);

      await expect(usuarioService.adicionarCampeonato(usuarioId, campeonato)).resolves.not.toBeDefined();
    });
    it("Deve retornar um erro caso não consiga salvar o usuário no banco", async () => {
      jest.spyOn(usuarioRepository, "findById").mockResolvedValue(usuarioCampeonato);
      jest.spyOn(usuarioRepository, "save").mockRejectedValue(new Error("Não foi possivel salvar dados do usuario no banco"));

      await expect(usuarioService.adicionarCampeonato(usuarioId, campeonato)).rejects.toThrow();
    });
    it("Deve adicionar corretamente um campeonato ao usuário", async () => {
      jest.spyOn(usuarioRepository, "findById").mockResolvedValue(usuarioCampeonato);
      jest.spyOn(usuarioRepository, "save").mockResolvedValue(usuarioCampeonato);

      await expect(usuarioService.adicionarCampeonato(usuarioId, campeonato)).resolves.not.toBeDefined();
      expect(usuarioRepository.save).toBeCalled();
    });
  });
});