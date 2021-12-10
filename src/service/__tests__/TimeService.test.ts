import BrasileiraoClient from '../../clients/BrasileiraoClient';
import * as faker from 'faker';
import { TimeRepository } from '../../repositories/TimeRepository';
import { TimeService } from '../../service/TimeService';
import { TabelaDTO } from '../../@types/dtos/brasileicaoClientDTO';
import { Time } from '../../models/TimeEntity';

describe("TimeService", () => {
    let timesRepo: TimeRepository;
    let brasileiraoClient: BrasileiraoClient;
    let timeService: TimeService;

    let idCampeonato: number;
    let tabelaResponse: TabelaDTO;
    let time: Time;
    let timeAtualizar: Time;


    beforeEach(() => {
        idCampeonato = faker.datatype.number();
        brasileiraoClient = new BrasileiraoClient();
        timesRepo = new TimeRepository();
        timeService = new TimeService(timesRepo, brasileiraoClient)

        tabelaResponse = {
            aproveitamento: faker.datatype.float() ,
            derrotas: faker.datatype.number(),
            empates: faker.datatype.number(),
            gols_contra: faker.datatype.number(),
            gols_pro: faker.datatype.number(),
            jogos: faker.datatype.number(),
            pontos: faker.datatype.number(),
            posicao: faker.datatype.number(20),
            saldo_gols: faker.datatype.number(),
            time: {
                escudo: faker.lorem.word(),
                nome_popular: faker.lorem.word(),
                sigla: faker.lorem.word(3),
                time_id: faker.datatype.number()
            },
            ultimos_jogos: [faker.lorem.word(1)],
            variacao_posicao: faker.datatype.number(),
            vitorias: faker.datatype.number(),
        }

        time = new Time();
        time.escudo = tabelaResponse.time.escudo;
        time.sigla = tabelaResponse.time.sigla;
        time.nome = tabelaResponse.time.nome_popular;

        timeAtualizar = new Time();
        timeAtualizar.escudo = faker.lorem.word();
        timeAtualizar.sigla = faker.lorem.word();
        timeAtualizar.nome = tabelaResponse.time.nome_popular;
    });
    beforeEach(jest.clearAllMocks);
    describe("gerarTimes", () => {
        it("Deve retornar erro caso não consiga buscar os dados da API", async () => {
            jest.spyOn(brasileiraoClient, "getTabelaAPI").mockRejectedValue(new Error("Erro ao buscar times na api"));

            await expect(timeService.gerarTimes(idCampeonato)).rejects.toThrow();
        });
        it("Deve retornar um erro caso não consiga buscar o time no banco de dados", async () => {
            jest.spyOn(brasileiraoClient, "getTabelaAPI").mockResolvedValue([tabelaResponse]);
            jest.spyOn(timesRepo, "findByNome").mockRejectedValue(new Error("Erro ao buscar times no banco"))
            
            await expect(timeService.gerarTimes(idCampeonato)).rejects.toThrow();
        });
        it("Deve retornar um erro caso não consiga salvar dados no banco", async () => {
            jest.spyOn(brasileiraoClient, "getTabelaAPI").mockResolvedValue([tabelaResponse]);
            jest.spyOn(timesRepo, "findByNome").mockResolvedValue(undefined);
            jest.spyOn(timesRepo, "save").mockRejectedValue(new Error("Erro ao salvar times na api"));
            
            await expect(timeService.gerarTimes(idCampeonato)).rejects.toThrow();
        });
        it("Deve salvar corretamente um time que ainda não está salva no banco de dados", async () => {
            jest.spyOn(brasileiraoClient, "getTabelaAPI").mockResolvedValue([tabelaResponse]);
            jest.spyOn(timesRepo, "findByNome").mockResolvedValue(undefined);
            jest.spyOn(timesRepo, "save").mockResolvedValue(time);

            await expect(timeService.gerarTimes(idCampeonato)).resolves.not.toBeDefined();
            expect(timesRepo.save).toHaveBeenCalled();
            expect(timesRepo.save).toHaveBeenCalledWith([time]);
        });
        it("Deve conferir os dados do time do banco com os recebidos e caso haja dados diferentes, alterar o time e salvar no banco", async () => {
            jest.spyOn(brasileiraoClient, "getTabelaAPI").mockResolvedValue([tabelaResponse]);
            jest.spyOn(timesRepo, "findByNome").mockResolvedValue(timeAtualizar);
            jest.spyOn(timesRepo, "save").mockResolvedValue(time);

            await expect(timeService.gerarTimes(idCampeonato)).resolves.not.toBeDefined();
            expect(timesRepo.save).toHaveBeenCalled();
            expect(timesRepo.save).toHaveBeenCalledWith([time]);
        });
        it("Deve conferir os dados do time do banco com os recebidos e caso não haja dados diferentes, apenas salvar o time no banco", async () => {
            jest.spyOn(brasileiraoClient, "getTabelaAPI").mockResolvedValue([tabelaResponse]);
            jest.spyOn(timesRepo, "findByNome").mockResolvedValue(time);
            jest.spyOn(timesRepo, "save").mockResolvedValue(time);

            await expect(timeService.gerarTimes(idCampeonato)).resolves.not.toBeDefined();
            expect(timesRepo.save).toHaveBeenCalled();
            expect(timesRepo.save).toHaveBeenCalledWith([time]);
        });
    });
});