import * as faker from 'faker';
import BrasileiraoClient from '../../clients/BrasileiraoClient';
import { PartidaRepository } from '../../repositories/PartidaRepository';
import { RodadaRepository } from '../../repositories/RodadaRepository';
import { TimeRepository } from '../../repositories/TimeRepository';
import { PartidaService } from '../../service/PartidaService';
import { RodadaService } from '../../service/RodadaService';
import { CampeonatoDTO, RodadaDTO, PartidaDTO } from '../../@types/dtos/brasileicaoClientDTO';
import { Rodada } from '../../models/RodadaEntity';
import { Partida } from '../../models/PartidaEntity';
import { Campeonato } from '../../models/CampeonatoEntity';

describe("EnderecoService", () => {
    let brasileiraoClient: BrasileiraoClient;
    let rodadaRepo: RodadaRepository;
    let partidaRepo: PartidaRepository;
    let timeRepo: TimeRepository;
    let partidaService: PartidaService;
    let rodadaService: RodadaService;
    let campeonatoResponse: CampeonatoDTO;
    let rodadaResponse: RodadaDTO;
    let partidaResponse: PartidaDTO;
    let partida: Partida;
    let rodada: Rodada;
    let campeonato: Campeonato;
    let rodadaId: number;
    let rodadaIdentica: Rodada;

    beforeEach(() => {
        brasileiraoClient = new BrasileiraoClient();
        rodadaRepo = new RodadaRepository();
        timeRepo = new TimeRepository();
        partidaRepo = new PartidaRepository();
        partidaService = new PartidaService(partidaRepo, timeRepo)
        rodadaService = new RodadaService(brasileiraoClient, rodadaRepo, partidaService);

        campeonato = new Campeonato();
        campeonato.id = faker.datatype.number();
        campeonato.idCampeonatoApiExterna = faker.datatype.number();

        partida = new Partida();

        rodadaId = faker.datatype.number();

        rodada = new Rodada();
        rodada.id = rodadaId;
        rodada.nome = faker.lorem.word();
        rodada.slug = faker.lorem.word();
        rodada.status = faker.lorem.word();
        rodada.partidas = [partida];

        campeonatoResponse = {
            _link:  faker.lorem.word(),
            nome: faker.lorem.word(),
            proxima_rodada: {
                nome: faker.lorem.word(),
                rodada: faker.datatype.number(),
                slug: faker.lorem.word(),
                status: faker.lorem.word(),
            },
            rodada: faker.datatype.number(),
            rodada_anterior: {
                nome: faker.lorem.word(),
                rodada: faker.datatype.number(),
                slug: faker.lorem.word(),
                status: faker.lorem.word(),
            },
            slug: faker.lorem.word(),
            status: faker.lorem.word()
        };
        partidaResponse = {
            _link: faker.lorem.word(),
            status: faker.lorem.word(),
            slug: faker.lorem.word(),
            placar: faker.lorem.word(),
            partida_id: faker.datatype.number(),
            estadio: {
                estadio_id: faker.datatype.number(),
                nome_popular: faker.lorem.word(),
            },
            data_realizacao: faker.lorem.word(),
            data_realizacao_iso: faker.date.past(),
            hora_realizacao: faker.lorem.word(),
            campeonato: {
                campeonato_id: faker.datatype.number(),
                nome: faker.lorem.word(),
                slug: faker.lorem.word(),
            },
            time_mandante: {
                escudo: faker.lorem.word(),
                nome_popular: faker.lorem.word(),
                sigla: faker.lorem.word(),
                time_id: faker.datatype.number(),
            },
            time_visitante: {
                escudo: faker.lorem.word(),
                nome_popular: faker.lorem.word(),
                sigla: faker.lorem.word(),
                time_id: faker.datatype.number(),
            },
            placar_mandante: null,
            placar_visitante: null
        }
        rodadaResponse = {
            _link: faker.lorem.word(),
            nome: faker.lorem.word(),
            proxima_rodada: {
                nome: faker.lorem.word(),
                rodada: faker.datatype.number(),
                slug: faker.lorem.word(),
                status: faker.lorem.word(),
            },
            rodada_anterior: {
                nome: faker.lorem.word(),
                rodada: faker.datatype.number(),
                slug: faker.lorem.word(),
                status: faker.lorem.word(),
            },
            rodada: faker.datatype.number(),
            slug: faker.lorem.word(),
            status: faker.lorem.word(),
            partidas: [partidaResponse]
        }
        rodadaIdentica = new Rodada();
        rodadaIdentica.rodada = rodadaResponse.rodada;
        rodadaIdentica.nome = rodadaResponse.nome;
        rodadaIdentica.status = rodadaResponse.status;
    });

    beforeEach(jest.clearAllMocks);
    describe("gerarRodadas", () => {
        it("Deve retornar um erro caso não seja possível retornar os dados do campeonato via API", async () => {
            jest.spyOn(brasileiraoClient, "getDadosCampeonatoAPI").mockRejectedValue(new Error("Erro ao buscar dados da API"));

            await expect(rodadaService.gerarRodadas(campeonato)).rejects.toThrow();
        });
        it("Deve retornar um erro caso não seja possível retornar os dados da rodada via API", async () => {
            jest.spyOn(brasileiraoClient, "getDadosCampeonatoAPI").mockResolvedValue([campeonatoResponse]);
            jest.spyOn(brasileiraoClient, "getRodadasAPI").mockRejectedValue(new Error("Erro ao buscar dados da API"));

            await expect(rodadaService.gerarRodadas(campeonato)).rejects.toThrow();
        });
        it("Deve retornar um erro caso não seja possível buscar dados no banco", async () => {
            jest.spyOn(brasileiraoClient, "getDadosCampeonatoAPI").mockResolvedValue([campeonatoResponse]);
            jest.spyOn(brasileiraoClient, "getRodadasAPI").mockResolvedValue(rodadaResponse);
            jest.spyOn(rodadaRepo, "findBySlug").mockRejectedValue(new Error("Erro ao buscar dados no banco"));

            await expect(rodadaService.gerarRodadas(campeonato)).rejects.toThrow();
        });
        it("Deve retornar um erro caso não seja possível gerar partidas", async () => {
            jest.spyOn(brasileiraoClient, "getDadosCampeonatoAPI").mockResolvedValue([campeonatoResponse]);
            jest.spyOn(brasileiraoClient, "getRodadasAPI").mockResolvedValue(rodadaResponse);
            jest.spyOn(rodadaRepo, "findBySlug").mockResolvedValue(undefined);
            jest.spyOn(partidaService, "gerarPartida").mockRejectedValue(new Error("Erro ao gerar partidas"));

            await expect(rodadaService.gerarRodadas(campeonato)).rejects.toThrow();
        });
        it("Deve retornar um erro caso não seja possível salvar rodadas no banco de dados", async () => {
            jest.spyOn(brasileiraoClient, "getDadosCampeonatoAPI").mockResolvedValue([campeonatoResponse]);
            jest.spyOn(brasileiraoClient, "getRodadasAPI").mockResolvedValue(rodadaResponse);
            jest.spyOn(rodadaRepo, "findBySlug").mockResolvedValue(undefined);
            jest.spyOn(partidaService, "gerarPartida").mockResolvedValue(partida);
            jest.spyOn(rodadaRepo, "save").mockRejectedValue(new Error("Salvar rodadas no banco"));

            await expect(rodadaService.gerarRodadas(campeonato)).rejects.toThrow();
        });
        it("Deve salvar corretamente a rodada no banco de dados", async () => {
            jest.spyOn(brasileiraoClient, "getDadosCampeonatoAPI").mockResolvedValue([campeonatoResponse]);
            jest.spyOn(brasileiraoClient, "getRodadasAPI").mockResolvedValue(rodadaResponse);
            jest.spyOn(rodadaRepo, "findBySlug").mockResolvedValue(undefined);
            jest.spyOn(partidaService, "gerarPartida").mockResolvedValue(partida);
            jest.spyOn(rodadaRepo, "save").mockResolvedValue(rodada);

            await expect(rodadaService.gerarRodadas(campeonato)).resolves.not.toBeDefined();
            expect(rodadaRepo.save).toBeCalled();
        });
        it("Deve atualizar corretamente uma rodada que já exista no banco de dados", async () => {
            jest.spyOn(brasileiraoClient, "getDadosCampeonatoAPI").mockResolvedValue([campeonatoResponse]);
            jest.spyOn(brasileiraoClient, "getRodadasAPI").mockResolvedValue(rodadaResponse);
            jest.spyOn(rodadaRepo, "findBySlug").mockResolvedValue(rodada);
            jest.spyOn(partidaService, "gerarPartida").mockResolvedValue(partida);
            jest.spyOn(rodadaRepo, "save").mockResolvedValue(rodada);

            await expect(rodadaService.gerarRodadas(campeonato)).resolves.not.toBeDefined();
            expect(rodadaRepo.save).toBeCalled();
        });
        it("Deve retornar e salvar no banco caso os dados recebidos sejam iguais aos do banco de dados", async () => {
            jest.spyOn(brasileiraoClient, "getDadosCampeonatoAPI").mockResolvedValue([campeonatoResponse]);
            jest.spyOn(brasileiraoClient, "getRodadasAPI").mockResolvedValue(rodadaResponse);
            jest.spyOn(rodadaRepo, "findBySlug").mockResolvedValue(rodadaIdentica);
            jest.spyOn(partidaService, "gerarPartida").mockResolvedValue(partida);
            jest.spyOn(rodadaRepo, "save").mockResolvedValue(rodadaIdentica);

            await expect(rodadaService.gerarRodadas(campeonato)).resolves.not.toBeDefined();
            expect(rodadaRepo.save).toBeCalled();
        });
    });
});