import { Campeonato } from "models/CampeonatoEntity";
import { CampeonatoDTO } from "../@types/dtos/campeonatoDTO";

export interface ICampeonatoService {
    gerarCampeonato(dadosCampeonato: CampeonatoDTO): Promise<CampeonatoDTO>;
    atualizarDadosCampeonato(campeonato: Campeonato): Promise<void>;
}