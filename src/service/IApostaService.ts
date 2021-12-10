import { classificacaoDTO } from "../@types/dtos/classificacaoDTO";
import { PalpiteDto } from "../@types/dtos/palpiteDto";

export interface IApostaService {
    gerarApostas(usuarioId: number, numeroRodada: number, palpites: PalpiteDto[]): Promise<void>;
    gerarClassificacao(): Promise<classificacaoDTO[]>; 
    atualizarPontuacao(): Promise<void>;
}