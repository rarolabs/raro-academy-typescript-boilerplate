import { ITimeRepository } from "repositories/ITimeRepository";
import { PartidaDTO } from "../@types/dtos/brasileicaoClientDTO";
import { Partida } from "../models/PartidaEntity";
import { IPartidaRepository } from "../repositories/IPartidaRepository";
import { IPartidaService } from "./IPartidaService";

export class PartidaService implements IPartidaService {
    constructor(
        private partidaRepository: IPartidaRepository,
        private timeRepository: ITimeRepository
        ) {}

    async gerarPartida(partidaResponse: PartidaDTO): Promise<Partida> {
        try {
            const partidaBD = await this.partidaRepository.findbySlug(partidaResponse.slug);
            if (partidaBD) {
                return this.atualizarPartida(partidaResponse, partidaBD);
            }

            return this.partidasFactory(partidaResponse);
        } catch (error) {
            throw new Error(`Houve um erro ao gerar partidas. Motivo: ${error.message}`);
        }
    }

    private async atualizarPartida(partidaResponse: PartidaDTO, partida: Partida): Promise<Partida> {
        if (partidaResponse.status !== partida.status) {
            partida.status = partidaResponse.status;
            partida.placarMandante = partidaResponse.placar_mandante;
            partida.placarVisitante = partidaResponse.placar_visitante;
        }
        if (partidaResponse.placar !== partida.placar) {
            partida.placar = partidaResponse.placar;
        }
        if (partida.dataRealizacao && partidaResponse.data_realizacao_iso) {
            if (new Date(partidaResponse.data_realizacao_iso).getTime() !== partida.dataRealizacao.getTime()) {
                partida.dataRealizacao = partidaResponse.data_realizacao_iso;
            }
        } else if (partidaResponse.data_realizacao_iso) {
            partida.dataRealizacao = partidaResponse.data_realizacao_iso;
        }
        return partida;
    }

    private async partidasFactory(partidaResponse: PartidaDTO): Promise<Partida> {
        const partida = new Partida();
        partida.slug = partidaResponse.slug;
        partida.status = partidaResponse.status;
        partida.dataRealizacao = partidaResponse.data_realizacao_iso;

        const mandante = await this.timeRepository.findByNome(partidaResponse.time_mandante.nome_popular);
        partida.mandante = mandante;

        const visitante = await this.timeRepository.findByNome(partidaResponse.time_visitante.nome_popular);
        partida.visitante = visitante;
        partida.placar = partidaResponse.placar;

        if (partidaResponse.status === 'finalizado') {
            partida.placarMandante = partidaResponse.placar_mandante;
            partida.placarVisitante = partidaResponse.placar_visitante;
        }
        return partida;
    }
}