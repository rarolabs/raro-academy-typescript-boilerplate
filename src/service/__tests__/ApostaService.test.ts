import { PalpiteDto } from '../../@types/dtos/palpiteDto';
import * as faker from 'faker';
import { ApostaRepository } from '../../repositories/ApostaRepository';
import { PartidaRepository } from '../../repositories/PartidaRepository';
import { RodadaRepository } from '../../repositories/RodadaRepository';
import { UsuarioRepository } from '../../repositories/UsuarioRepository';
import { Usuario } from '../../models/UsuarioEntity';
import { Rodada } from '../../models/RodadaEntity';
import { Campeonato } from '../../models/CampeonatoEntity';
import { ApostaService } from '../../service/ApostaService';
import { Partida } from '../../models/PartidaEntity';
import { Aposta } from '../../models/ApostaEntity';

describe("ApostaService", () => {
    let usuarioId: number;
    let usuarioId2: number;
    let partidaId: number;
    let campeonatoId: number;
    let numeroRodada: number;
    let rodadaId: number;
    let palpite: PalpiteDto;
    let usuario: Usuario;
    let usuario2: Usuario;
    let rodada: Rodada;
    let campeonato: Campeonato;
    let partida: Partida;
    let aposta: Aposta;
    let apostaPontuada: Aposta;
    let apostaPontuada2: Aposta;

    let apostaRepo: ApostaRepository;
    let rodadaRepo: RodadaRepository;
    let usuarioRepo: UsuarioRepository;
    let partidaRepo: PartidaRepository;
    let apostaService: ApostaService;

    beforeEach(() => {
        apostaRepo = new ApostaRepository();
        rodadaRepo = new RodadaRepository();
        usuarioRepo = new UsuarioRepository();
        partidaRepo = new PartidaRepository();
        apostaService = new ApostaService(apostaRepo, usuarioRepo, partidaRepo, rodadaRepo);

        usuarioId = faker.datatype.number();
        usuarioId2 = faker.datatype.number();
        campeonatoId = faker.datatype.number();
        partidaId = faker.datatype.number();
        rodadaId = faker.datatype.number();
        numeroRodada = faker.datatype.number(20);

        campeonato = new Campeonato();
        campeonato.idCampeonatoApiExterna = faker.datatype.number();
        campeonato.logo = faker.lorem.word();
        campeonato.nome = faker.lorem.word();
        campeonato.nomePopular = faker.lorem.word();
        campeonato.slug = faker.lorem.word();
        campeonato.status = 'ativo';
        campeonato.id = campeonatoId;

        usuario = new Usuario();
        usuario.nome = faker.lorem.word();
        usuario.hashSenha = faker.internet.password();
        usuario.email = faker.internet.email();
        usuario.id = usuarioId;
        usuario.campeonatos = [];

        usuario2 = new Usuario();
        usuario2.nome = faker.lorem.word();
        usuario2.hashSenha = faker.internet.password();
        usuario2.email = faker.internet.email();
        usuario2.id = faker.datatype.number();
        usuario2.campeonatos = [];

        rodada = new Rodada();
        rodada.campeonato = campeonato;
        rodada.nome = faker.lorem.word();
        rodada.rodada = numeroRodada;
        rodada.status = faker.lorem.word();
        rodada.slug = faker.lorem.word();
        rodada.id = rodadaId;

        partida = new Partida();
        partida.id = partidaId;
        partida.placarMandante = faker.datatype.number();
        partida.placarVisitante = faker.datatype.number();
        
        palpite = {
            golsMandante: partida.placarMandante,
            golsVisitante: partida.placarVisitante,
            partidaID: partidaId,
        }

        aposta = new Aposta();
        aposta.partida = partida;
        aposta.placarMandante = palpite.golsMandante;
        aposta.placarVisitante = palpite.golsVisitante;
        aposta.usuario = usuario;

        apostaPontuada = aposta;
        apostaPontuada.pontos = faker.datatype.number();

        apostaPontuada2 = new Aposta();
        apostaPontuada2.usuario = usuario2;
        apostaPontuada2.partida = partida;
        apostaPontuada2.placarMandante = palpite.golsMandante;
        apostaPontuada2.placarVisitante = palpite.golsVisitante;
        apostaPontuada2.pontos = faker.datatype.number();
    });

    beforeEach(jest.clearAllMocks);
    describe("gerarApostas", () => {
        it("Deve retornar um erro caso não consiga buscar o usuário no banco de dados", async () => {
            jest.spyOn(usuarioRepo, "findById").mockRejectedValue(new Error("Não foi possivel buscar dados do usuario no banco"));

            await expect(apostaService.gerarApostas(usuarioId, numeroRodada, [palpite])).rejects.toThrow();
        });
        it("Deve retornar um erro caso não consiga buscar a rodada no banco de dados", async () => {
            jest.spyOn(usuarioRepo, "findById").mockResolvedValue(usuario);
            jest.spyOn(rodadaRepo, "findByNumeroRodada").mockRejectedValue(new Error("Não foi possivel buscar dados da rodada no banco"));

            await expect(apostaService.gerarApostas(usuarioId, numeroRodada, [palpite])).rejects.toThrow();
        });
        it("Deve retornar um erro caso o usuário não esteja cadastrado no campeonato que se deseja apostar", async () => {
            jest.spyOn(usuarioRepo, "findById").mockResolvedValue(usuario);
            jest.spyOn(rodadaRepo, "findByNumeroRodada").mockResolvedValue(rodada);

            await expect(apostaService.gerarApostas(usuarioId, numeroRodada, [palpite])).rejects.toThrow();
        });
        it("Deve retornar um erro caso não consiga buscar as partidas no banco de dados", async () => {
            usuario.campeonatos = [campeonato];
            jest.spyOn(usuarioRepo, "findById").mockResolvedValue(usuario);
            jest.spyOn(rodadaRepo, "findByNumeroRodada").mockResolvedValue(rodada);
            jest.spyOn(partidaRepo, "findbyRodadaId").mockRejectedValue(new Error("Não foi possivel buscar dados das partidas no banco"));

            await expect(apostaService.gerarApostas(usuarioId, numeroRodada, [palpite])).rejects.toThrow();
        });
        it("Deve retornar um erro caso não consiga buscar as apostas no banco de dados", async () => {
            usuario.campeonatos = [campeonato];
            jest.spyOn(usuarioRepo, "findById").mockResolvedValue(usuario);
            jest.spyOn(rodadaRepo, "findByNumeroRodada").mockResolvedValue(rodada);
            jest.spyOn(partidaRepo, "findbyRodadaId").mockResolvedValue([partida]);
            jest.spyOn(apostaRepo, "findbyUsuarioAndPartida").mockRejectedValue(new Error("Não foi possivel buscar dados da aposta no banco"));

            await expect(apostaService.gerarApostas(usuarioId, numeroRodada, [palpite])).rejects.toThrow();
        });
        it("Deve retornar um erro caso não consiga salvar as apostas no banco de dados", async () => {
            usuario.campeonatos = [campeonato];
            jest.spyOn(usuarioRepo, "findById").mockResolvedValue(usuario);
            jest.spyOn(rodadaRepo, "findByNumeroRodada").mockResolvedValue(rodada);
            jest.spyOn(partidaRepo, "findbyRodadaId").mockResolvedValue([partida]);
            jest.spyOn(apostaRepo, "findbyUsuarioAndPartida").mockResolvedValue(undefined);
            jest.spyOn(apostaRepo, "save").mockRejectedValue(new Error("Não foi possível salvar os dados no banco"));

            await expect(apostaService.gerarApostas(usuarioId, numeroRodada, [palpite])).rejects.toThrow();
        });
        it("Deve salvar corretamente as aposta no banco de dados", async () => {
            usuario.campeonatos = [campeonato];
            jest.spyOn(usuarioRepo, "findById").mockResolvedValue(usuario);
            jest.spyOn(rodadaRepo, "findByNumeroRodada").mockResolvedValue(rodada);
            jest.spyOn(partidaRepo, "findbyRodadaId").mockResolvedValue([partida]);
            jest.spyOn(apostaRepo, "findbyUsuarioAndPartida").mockResolvedValue(undefined);
            jest.spyOn(apostaRepo, "save").mockResolvedValue(aposta);

            await expect(apostaService.gerarApostas(usuarioId, numeroRodada, [palpite])).resolves.not.toBeDefined();
            expect(apostaRepo.save).toBeCalled();
        });
        it("Não deve salvar nada no banco caso não haja apostas novas", async () => {
            usuario.campeonatos = [campeonato];
            partida.id = faker.datatype.number();
            jest.spyOn(usuarioRepo, "findById").mockResolvedValue(usuario);
            jest.spyOn(rodadaRepo, "findByNumeroRodada").mockResolvedValue(rodada);
            jest.spyOn(partidaRepo, "findbyRodadaId").mockResolvedValue([partida]);
            jest.spyOn(apostaRepo, "findbyUsuarioAndPartida").mockResolvedValue(undefined);

            await expect(apostaService.gerarApostas(usuarioId, numeroRodada, [palpite])).resolves.not.toBeDefined();
        });
        it("Não deve fazer nada e retornar a aposta caso já tenha feito uma aposta para esta partida", async () => {
            usuario.campeonatos = [campeonato];
            jest.spyOn(usuarioRepo, "findById").mockResolvedValue(usuario);
            jest.spyOn(rodadaRepo, "findByNumeroRodada").mockResolvedValue(rodada);
            jest.spyOn(partidaRepo, "findbyRodadaId").mockResolvedValue([partida]);
            jest.spyOn(apostaRepo, "findbyUsuarioAndPartida").mockResolvedValue(aposta);
            
            await expect(apostaService.gerarApostas(usuarioId, numeroRodada, [palpite])).resolves.not.toBeDefined();
        });
        it("Deve retornar um erro caso o campeonato não esteja ativo", async () => {
            campeonato.status = faker.lorem.word();
            jest.spyOn(rodadaRepo, "findByNumeroRodada").mockResolvedValue(rodada);
            jest.spyOn(usuarioRepo, "findById").mockResolvedValue(usuario);
            
            await expect(apostaService.gerarApostas(usuarioId, numeroRodada, [palpite])).rejects.toThrow();
        });
    });
    describe("atualizarPontuacao", () => {
        it("Deve retornar um erro caso não consiga buscar as apostas do banco", async () => {
            jest.spyOn(apostaRepo, "findAll").mockRejectedValue(new Error("Não foi possivel buscar dado das apostas no banco"));

            await expect(apostaService.atualizarPontuacao()).rejects.toThrow();
        });
        it("Deve retornar um erro caso não consiga buscar as apostas do banco", async () => {
            jest.spyOn(apostaRepo, "findAll").mockResolvedValue([aposta]);
            jest.spyOn(apostaRepo, "save").mockRejectedValue(new Error("Não foi possivel salvar as apostas no banco"))

            await expect(apostaService.atualizarPontuacao()).rejects.toThrow();
        });
        it("Não deve atualizar apostas de jogos não finalizados", async () => {
            partida.status = faker.lorem.word();
            jest.spyOn(apostaRepo, "findAll").mockResolvedValue([aposta]);
            jest.spyOn(apostaRepo, "save").mockResolvedValue(aposta);

            await expect(apostaService.atualizarPontuacao()).resolves.not.toBeDefined();
            expect(apostaRepo.save).toBeCalledWith(undefined);
        });
        it("Deve atualizar corretamente a pontuação de apostas no banco em jogos finalizados", async () => {
            partida.status = "finalizado";
            jest.spyOn(apostaRepo, "findAll").mockResolvedValue([aposta]);
            jest.spyOn(apostaRepo, "save").mockResolvedValue(aposta);
            
            await expect(apostaService.atualizarPontuacao()).resolves.not.toBeDefined();
            expect(apostaRepo.save).toBeCalledWith(expect.objectContaining({pontos: expect.any(Number)}));
        });
        it("Deve atualizar corretamente a pontuação de apostas no banco em jogos finalizados, cenário para erro em todos os casos", async () => {
            partida.placarMandante = faker.datatype.number();
            partida.placarVisitante = faker.datatype.number(1);
            partida.status = "finalizado";
            jest.spyOn(apostaRepo, "findAll").mockResolvedValue([aposta]);
            jest.spyOn(apostaRepo, "save").mockResolvedValue(aposta);
            
            await expect(apostaService.atualizarPontuacao()).resolves.not.toBeDefined();
            expect(apostaRepo.save).toBeCalledWith(expect.objectContaining({pontos: expect.any(Number)}));
        });
    });
    describe("gerarClassificacao", () => {
        it("Deve retornar um erro caso não consiga buscar as apostas do banco", async () => {
            jest.spyOn(apostaRepo, "findAll").mockRejectedValue(new Error("Não foi possivel buscar dado das apostas no banco"));

            await expect(apostaService.gerarClassificacao()).rejects.toThrow();
        });
        it("Deve retornar um erro caso não consiga buscar os usuarios no banco", async () => {
            jest.spyOn(apostaRepo, "findAll").mockResolvedValue([apostaPontuada]);
            jest.spyOn(usuarioRepo, "findById").mockRejectedValue(new Error("Não foi possivel buscar dado das apostas no banco"));

            await expect(apostaService.gerarClassificacao()).rejects.toThrow();
        });
        it("Deve retornar a classificação", async () => {
            jest.spyOn(apostaRepo, "findAll").mockResolvedValue([apostaPontuada, apostaPontuada2]);
            jest.spyOn(usuarioRepo, "findById").mockResolvedValueOnce(usuario);
            jest.spyOn(usuarioRepo, "findById").mockResolvedValueOnce(usuario2);

            const resposta = await expect(apostaService.gerarClassificacao()).resolves.toBeDefined();
            expect(resposta).not.toBeNull();
        });
    });
});