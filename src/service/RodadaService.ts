import { Rodada } from "../models/RodadaEntity";
import BrasileiraoClient from "../clients/BrasileiraoClient";
import { RodadaDTO } from "../@types/dtos/brasileicaoClientDTO";
import { IRodadaRepository } from "../repositories/IRodadaRepository";
import { Campeonato } from "../models/CampeonatoEntity";
import { IPartidaService } from "./IPartidaService";
import { IRodadaService } from "./IRodadaService";

export class RodadaService implements IRodadaService {
    constructor(
        private brasileiraoClient: BrasileiraoClient,
        private rodadaRepository: IRodadaRepository,
        private partidaService: IPartidaService
        ) {}

    async gerarRodadas(campeonato: Campeonato): Promise<void> {
        try {
            const rodadas = await this.buscarRodadaAPI(campeonato);
            await this.rodadaRepository.save(rodadas);
            return;
        } catch (error) {
            throw new Error(`Erro ao gerar rodadas: Motivo ${error.message}`);
        }
    }

    private async buscarRodadaAPI(campeonato: Campeonato): Promise<Rodada[]> {
        try {
            const dadosCampeonato = await this.brasileiraoClient.getDadosCampeonatoAPI(campeonato.idCampeonatoApiExterna);
            const rodadasPromiseAPI = dadosCampeonato.map(rodada => {
                return this.brasileiraoClient.getRodadasAPI(rodada.rodada, campeonato.idCampeonatoApiExterna);
            });
            const rodadasDaApi = await Promise.all(rodadasPromiseAPI);

            const rodadasPromiseBD = rodadasDaApi.map(async rodada => {
                const rodadaBD = await this.rodadaRepository.findBySlug(rodada.slug);
                if (rodadaBD) {
                    return this.atualizarRodada(rodada, rodadaBD);
                }

                return this.rodadasFactory(rodada, campeonato);
            }, this);

            const rodadas = await Promise.all(rodadasPromiseBD);
            return rodadas;
        } catch (error) {
            throw new Error(`Erro ao buscar rodadas na API. Motivo ${error.message}`);
        }
    }

    private async atualizarRodada(rodadaResponse: RodadaDTO, rodada: Rodada): Promise<Rodada> {
        if (rodada.status !== rodadaResponse.status) {
            rodada.status = rodadaResponse.status;
        }
        if (rodada.nome !== rodadaResponse.nome) {
            rodada.nome = rodadaResponse.nome;
        }
        if (rodada.rodada !== rodadaResponse.rodada) {
            rodada.rodada = rodadaResponse.rodada;
        }
        const partidaPromise = rodadaResponse.partidas.map(partida => {
            return this.partidaService.gerarPartida(partida)
        }, this)

        rodada.partidas = await Promise.all(partidaPromise);

        return rodada
    }

    private async rodadasFactory(rodadaResponse: RodadaDTO, campeonato: Campeonato): Promise<Rodada> {
        const rodada = new Rodada();
        rodada.nome = rodadaResponse.nome;
        rodada.slug = rodadaResponse.slug;
        rodada.status = rodadaResponse.status;
        rodada.rodada = rodadaResponse.rodada;
        rodada.campeonato = campeonato;

        const partidasPromise = rodadaResponse.partidas.map(partida => {
            return this.partidaService.gerarPartida(partida)
        }, this);

        rodada.partidas = await Promise.all(partidasPromise);
        return rodada;
    }

}