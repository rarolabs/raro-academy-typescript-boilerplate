import { PartidaDTO } from '../../@types/dtos/brasileicaoClientDTO';
import * as faker from 'faker';
import { Partida } from '../../models/PartidaEntity';
import { PartidaRepository } from '../../repositories/PartidaRepository';
import { TimeRepository } from '../../repositories/TimeRepository';
import { PartidaService } from '../../service/PartidaService';
import { Time } from '../../models/TimeEntity';


describe("PartidaService", () => {
    let partidaRepo: PartidaRepository;
    let timeRepo: TimeRepository;
    let partidaService: PartidaService;
    let partida: Partida;
    let partidaResponse: PartidaDTO;
    let mandante: Time;
    let visitante: Time;

    let partidaId: number;

    beforeEach(() => {
        partidaRepo = new PartidaRepository();
        timeRepo = new TimeRepository();
        partidaService = new PartidaService(partidaRepo, timeRepo);
        partidaId = faker.datatype.number();

        mandante = new Time();
        mandante.id = faker.datatype.number();
        mandante.nome = faker.lorem.word();
        mandante.sigla = faker.lorem.word(3);

        visitante = new Time();
        visitante.id = faker.datatype.number();
        visitante.nome = faker.lorem.word();
        visitante.sigla = faker.lorem.word(3);

        partida = new Partida();
        partida.id = partidaId;
        partida.mandante = mandante;
        partida.visitante = visitante;
        partida.slug = faker.lorem.word();
        partida.status = faker.lorem.word();
        partida.placar = faker.lorem.word(10);
        partida.dataRealizacao = faker.date.past();

        partidaResponse = {
            _link: faker.lorem.word(),
            status: partida.status,
            slug: partida.slug,
            placar: partida.placar,
            partida_id: partidaId,
            estadio: {
                estadio_id: faker.datatype.number(),
                nome_popular: faker.lorem.word(),
            },
            data_realizacao: faker.lorem.word(),
            data_realizacao_iso: partida.dataRealizacao,
            hora_realizacao: faker.lorem.word(),
            campeonato: {
                campeonato_id: faker.datatype.number(),
                nome: faker.lorem.word(),
                slug: faker.lorem.word(),
            },
            time_mandante: {
                escudo: mandante.escudo,
                nome_popular: mandante.nome,
                sigla: mandante.sigla,
                time_id: faker.datatype.number(),
            },
            time_visitante: {
                escudo: visitante.escudo,
                nome_popular: visitante.nome,
                sigla: visitante.sigla,
                time_id: faker.datatype.number(),
            },
            placar_mandante: null,
            placar_visitante: null
        }

    });

    beforeEach(jest.clearAllMocks);
    describe("gerarPartida", () => {
        it("Deve retornar um erro caso não consiga retornar os dados do banco", async () => {
            jest.spyOn(partidaRepo, "findbySlug").mockRejectedValue(new Error("Não foi possível retornar dados do banco"));

            await expect(partidaService.gerarPartida(partidaResponse)).rejects.toThrow();
        });
        it("Deve retornar um erro caso não consiga retornar os dados do banco", async () => {
            jest.spyOn(partidaRepo, "findbySlug").mockResolvedValue(undefined);
            jest.spyOn(timeRepo, "findByNome").mockRejectedValue(new Error("Não foi possivel retornar dados do banco"));

            await expect(partidaService.gerarPartida(partidaResponse)).rejects.toThrow();
        });
        it("Deve criar uma nova partida caso ela não exista no sistema", async () => {
            partidaResponse.status = "finalizado";
            partidaResponse.placar_mandante = faker.datatype.number();
            partidaResponse.placar_visitante = faker.datatype.number();

            jest.spyOn(partidaRepo, "findbySlug").mockResolvedValue(undefined);
            jest.spyOn(timeRepo, "findByNome").mockResolvedValueOnce(mandante);
            jest.spyOn(timeRepo, "findByNome").mockResolvedValueOnce(visitante);

            const resposta = await partidaService.gerarPartida(partidaResponse);
            expect(resposta.status).toBe("finalizado");
            expect(resposta.placarMandante).not.toBeNull();
            expect(resposta.placarVisitante).not.toBeNull();
        });
        it("Deve criar uma nova partida com os dados finalizados caso ela não exista no sistema e o status dela seja finalizado", async () => {
            partida.id = undefined;
            jest.spyOn(partidaRepo, "findbySlug").mockResolvedValue(undefined);
            jest.spyOn(timeRepo, "findByNome").mockResolvedValueOnce(mandante);
            jest.spyOn(timeRepo, "findByNome").mockResolvedValueOnce(visitante);

            await expect(partidaService.gerarPartida(partidaResponse)).resolves.toEqual(partida);
        });
        it("Deve atualizar uma partida caso ela exista no sistema", async () => {
            const novaData = faker.date.past();
            const novoPlacar = faker.lorem.word();
            partidaResponse.status = "finalizado";

            partidaResponse.placar_mandante = faker.datatype.number();
            partidaResponse.placar_visitante = faker.datatype.number();
            partidaResponse.placar = novoPlacar;
            partidaResponse.data_realizacao_iso = novaData;
            jest.spyOn(partidaRepo, "findbySlug").mockResolvedValue(partida);

            const resposta = await partidaService.gerarPartida(partidaResponse);
            expect(resposta.status).toBe("finalizado");
            expect(resposta.dataRealizacao).toBe(novaData);
        });
        it("Deve retornar uma partida do banco de dados caso ela não tenha dados para alterar", async () => {
            jest.spyOn(partidaRepo, "findbySlug").mockResolvedValue(partida);

            await expect(partidaService.gerarPartida(partidaResponse)).resolves.toEqual(partida);
        });
        it("Deve adicionar uma data caso a data esteja nula", async () => {
            partida.dataRealizacao = null;
            jest.spyOn(partidaRepo, "findbySlug").mockResolvedValue(partida);

            const resposta = await partidaService.gerarPartida(partidaResponse);
            expect(resposta.dataRealizacao).toBeDefined();
        });
        it("Deve retornar uma partida do banco de dados caso ela não tenha dados para alterar e a data esteja nula", async () => {
            partida.dataRealizacao = null;
            partidaResponse.data_realizacao_iso = null;
            jest.spyOn(partidaRepo, "findbySlug").mockResolvedValue(partida);

            const resposta = await partidaService.gerarPartida(partidaResponse);
            expect(resposta.dataRealizacao).toBeNull();
        });
    });
});