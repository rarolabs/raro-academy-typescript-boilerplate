import { Campeonato } from "models/CampeonatoEntity";

export interface IRodadaService {
    gerarRodadas(campeonato: Campeonato): Promise<void>;
}