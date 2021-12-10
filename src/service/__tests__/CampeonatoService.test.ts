import * as faker from 'faker';
import { CampeonatoRepository } from '../../repositories/CampeonatoRepository';
import { TimeRepository } from '../../repositories/TimeRepository';
import { TimeService } from '../../service/TimeService';
import { CampeonatoService } from '../../service/CampeonatoService';
import { RodadaRepository } from '../../repositories/RodadaRepository';
import { RodadaService } from '../../service/RodadaService';
import BrasileiraoClient from '../../clients/BrasileiraoClient';
import { PartidaService } from '../../service/PartidaService';
import { PartidaRepository } from '../../repositories/PartidaRepository';
import { CampeonatoDTO } from '../../@types/dtos/campeonatoDTO';
import { Campeonato } from '../../models/CampeonatoEntity';

describe("EnderecoService", () => {
    let brasileiraoClient: BrasileiraoClient;
    let campeonatoRepo: CampeonatoRepository;
    let campeonatoService: CampeonatoService;
    let timeRepo: TimeRepository;
    let timeService: TimeService;
    let rodadaRepo: RodadaRepository;
    let rodadaService: RodadaService;
    let partidaRepo: PartidaRepository;
    let partidaService: PartidaService;

    let dadosCampeonato: CampeonatoDTO;
    let idCampeonato: number;
    let campeonato: Campeonato


    beforeEach(() => {
        brasileiraoClient = new BrasileiraoClient();
        campeonatoRepo = new CampeonatoRepository();
        timeRepo = new TimeRepository();
        rodadaRepo = new RodadaRepository();
        partidaRepo = new PartidaRepository();
        partidaService = new PartidaService(partidaRepo, timeRepo);
        timeService = new TimeService(timeRepo, brasileiraoClient);
        rodadaService = new RodadaService(brasileiraoClient, rodadaRepo, partidaService);
        campeonatoService = new CampeonatoService(campeonatoRepo, timeService, rodadaService);

        idCampeonato = faker.datatype.number();

        campeonato = new Campeonato();
        campeonato.id = idCampeonato;
        campeonato.idCampeonatoApiExterna = faker.datatype.number();
        campeonato.logo = faker.lorem.word();
        campeonato.nome = faker.lorem.word();
        campeonato.nomePopular = faker.lorem.word();
        campeonato.slug = faker.lorem.word();
        campeonato.status = faker.lorem.word();

        dadosCampeonato = {
            idCampeonatoApiExterna: faker.datatype.number(),
            logo: faker.lorem.word(),
            nome: faker.lorem.word(),
            nomePopular: faker.lorem.word(),
            slug: faker.lorem.word(),
            status: faker.lorem.word()
        }
    });

    beforeEach(jest.clearAllMocks);
    describe("gerarCampeonato", () => {
        it("Deve retornar erro caso não seja possível buscar dados do banco", async () => {
            jest.spyOn(campeonatoRepo, "findBySlug").mockRejectedValue(new Error("Erro ao buscar dados no banco"));

            await expect(campeonatoService.gerarCampeonato(dadosCampeonato)).rejects.toThrow();
        });
        it("Deve retornar erro caso não seja possível salvar dados do banco", async () => {
            jest.spyOn(campeonatoRepo, "findBySlug").mockResolvedValue(undefined);
            jest.spyOn(campeonatoRepo, "save").mockRejectedValue(new Error("Erro ao salvar dados no banco"));
            
            await expect(campeonatoService.gerarCampeonato(dadosCampeonato)).rejects.toThrow();
        });
        it("Deve salvar corretamente um novo campeonato no banco de dados", async () => {
            jest.spyOn(campeonatoRepo, "findBySlug").mockResolvedValue(undefined);
            jest.spyOn(campeonatoRepo, "save").mockResolvedValue(campeonato);
            
            await expect(campeonatoService.gerarCampeonato(dadosCampeonato)).resolves.toEqual(campeonato);
            expect(campeonatoRepo.save).toBeCalled();
        });
        it("Deve retornar um campeonato caso este já exista no banco de dados e salva no banco de dados", async () => {
            jest.spyOn(campeonatoRepo, "findBySlug").mockResolvedValue(campeonato);
            jest.spyOn(campeonatoRepo, "save").mockResolvedValue(campeonato);
            
            await expect(campeonatoService.gerarCampeonato(dadosCampeonato)).resolves.toEqual(campeonato);
            expect(campeonatoRepo.save).toBeCalled();
        });
    });
    describe("atualizarDadosCampeonato", () => {
        it("Deve retornar um erro caso não consiga gerarTimes", async () => {
            jest.spyOn(timeService, "gerarTimes").mockRejectedValue(new Error("Erro ao gerar Times"));

            await expect(campeonatoService.atualizarDadosCampeonato(campeonato)).rejects.toThrow();
        });
        it("Deve retornar um erro caso não consiga gerarRodadas", async () => {
            jest.spyOn(timeService, "gerarTimes").mockResolvedValue();
            jest.spyOn(rodadaService, "gerarRodadas").mockRejectedValue(new Error("Erro ao gerar Rodadas"));

            await expect(campeonatoService.atualizarDadosCampeonato(campeonato)).rejects.toThrow();
        });
        it("Deve atualizar os dados do campeonato corretamente", async () => {
            jest.spyOn(timeService, "gerarTimes").mockResolvedValue();
            jest.spyOn(rodadaService, "gerarRodadas").mockResolvedValue();

            await expect(campeonatoService.atualizarDadosCampeonato(campeonato)).resolves.not.toBeDefined();
            expect(timeService.gerarTimes).toBeCalledWith(campeonato.idCampeonatoApiExterna);
            expect(rodadaService.gerarRodadas).toBeCalledWith(campeonato);
        })
    })
});