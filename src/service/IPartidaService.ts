import { PartidaDTO } from "../@types/dtos/brasileicaoClientDTO";
import { Partida } from "models/PartidaEntity";


export interface IPartidaService {
    gerarPartida(partidaResponse: PartidaDTO): Promise<Partida>;
}