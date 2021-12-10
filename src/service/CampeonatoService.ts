import { CampeonatoDTO } from "../@types/dtos/campeonatoDTO";
import { ICampeonatoRespository } from "../repositories/ICampeonatoRepository";
import { Campeonato } from "../models/CampeonatoEntity";
import { IRodadaService } from "./IRodadaService";
import { ITimeService } from "./ITimeService";
import { ICampeonatoService } from "./ICampeonatoService";

export class CampeonatoService implements ICampeonatoService {
    constructor(
        private campeonatoRepository: ICampeonatoRespository,
        private timesService: ITimeService,
        private rodadaService: IRodadaService
        ) {}

    async gerarCampeonato(dadosCampeonato: CampeonatoDTO): Promise<Campeonato> {
        try {
            const campeonatoClasse = await this.campeonatoFactory(dadosCampeonato);
            const campeonatoBD = await this.campeonatoRepository.save(campeonatoClasse);
            return campeonatoBD;
        } catch (error) {
            throw new Error(`Erro ao criar campeonato. Motivo: ${error.message}`);
        }
    }
    
    async atualizarDadosCampeonato(campeonato: Campeonato): Promise<void> {
        try {
            await this.timesService.gerarTimes(campeonato.idCampeonatoApiExterna);
            await this.rodadaService.gerarRodadas(campeonato);
            return;
        } catch (error) {
            throw new Error(`Erro ao atualizar dados do campeonato. Motivo: ${error.message}`);
        }
    }

    private async campeonatoFactory(dadosCampeonato: CampeonatoDTO): Promise<Campeonato>{
        try {
            const campeonatoBD = await this.campeonatoRepository.findBySlug(dadosCampeonato.slug);
            if (campeonatoBD) {
                return campeonatoBD;
            }

            const campeonato = new Campeonato();
            campeonato.idCampeonatoApiExterna = dadosCampeonato.idCampeonatoApiExterna;
            campeonato.logo = dadosCampeonato.logo;
            campeonato.nome = dadosCampeonato.nome;
            campeonato.nomePopular = dadosCampeonato.nomePopular;
            campeonato.slug = dadosCampeonato.slug;
            campeonato.status = dadosCampeonato.status;
            return campeonato;
        } catch (error) {
            throw new Error(`Erro ao gerar campeonato. Motivo: ${error.message}`);
        }
    }
}