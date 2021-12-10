export interface ITimeService {
    gerarTimes(idCampeonato: number): Promise<void>;
}