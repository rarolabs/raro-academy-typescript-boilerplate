import { ITimeRepository } from "../repositories/ITimeRepository";
import BrasileiraoClient from "../clients/BrasileiraoClient";
import { TimeDTO } from "../@types/dtos/brasileicaoClientDTO";
import { Time } from "../models/TimeEntity";
import { ITimeService } from "./ITimeService";

export class TimeService implements ITimeService {
    constructor(
        private timeRepository: ITimeRepository,
        private brasileiraoClient: BrasileiraoClient
        ) {}

    async gerarTimes(idCampeonato: number): Promise<void> {
        try {
            const tabelaResponse = await this.brasileiraoClient.getTabelaAPI(idCampeonato);

            const tabelaPromise = tabelaResponse.map(async ({time}) => {
                const timeBD = await this.timeRepository.findByNome(time.nome_popular);
                if (timeBD) {
                    return this.atualizarTime(time, timeBD);
                }

                return this.timesFactory(time);
            }, this)
            const times = await Promise.all(tabelaPromise);

            await this.timeRepository.save(times);
            return;
        } catch (error) {
            throw new Error(`Erro ao criar times. Motivo ${error.message}`);
        }
    }

    private atualizarTime(timeResponse: TimeDTO, time: Time): Time {
        if (timeResponse.sigla !== time.sigla) {
            time.sigla = timeResponse.sigla;
        }
        if (timeResponse.escudo !== time.escudo) {
            time.escudo = timeResponse.escudo;
        }
        return time;
    }

    private timesFactory(timeResponse: TimeDTO): Time {
        const time = new Time();
        time.nome = timeResponse.nome_popular;
        time.escudo = timeResponse.escudo;
        time.sigla = timeResponse.sigla;
        return time;
    }
}
