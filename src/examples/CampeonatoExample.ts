import BrasileiraoClient from "../clients/BrasileiraoClient";
import { CampeonatoRepository } from "../repositories/CampeonatoRepository";
import { RodadaRepository } from "../repositories/RodadaRepository";
import { CampeonatoService } from "../service/CampeonatoService";
import { RodadaService } from "../service/RodadaService";
import { Connection } from "typeorm";
import { TimeRepository } from "../repositories/TimeRepository";
import { TimeService } from "../service/TimeService";
import { PartidaService } from "../service/PartidaService";
import { PartidaRepository } from "../repositories/PartidaRepository";

export const criarCampeonato = async (connection: Connection) => {
    const brasileiraoClient = new BrasileiraoClient();
    const rodadaRepo = connection.getCustomRepository(RodadaRepository);
    const campeonatoRepo = connection.getCustomRepository(CampeonatoRepository);
    const partidaRepo = connection.getCustomRepository(PartidaRepository);
    const timeRepo = connection.getCustomRepository(TimeRepository);

    const timesService = new TimeService(timeRepo, brasileiraoClient);
    const partidaService = new PartidaService(partidaRepo, timeRepo);
    const rodadaService = new RodadaService(brasileiraoClient, rodadaRepo, partidaService);
    const campeonatoService = new CampeonatoService(campeonatoRepo, timesService, rodadaService);
    
    const dadosCampeonato = {
        nome: "Campeonato Brasileiro",
        slug: "brasileirão-2021",
        nomePopular: "Brasileirão",
        status: "ativo",
        logo: "BRLOGO",
        idCampeonatoApiExterna: 10,
    }
    
    const campeonato = await campeonatoService.gerarCampeonato(dadosCampeonato);
};

export const atualizarCampeonato = async (connection: Connection) => {
    const brasileiraoClient = new BrasileiraoClient();
    const rodadaRepo = connection.getCustomRepository(RodadaRepository);
    const campeonatoRepo = connection.getCustomRepository(CampeonatoRepository);
    const partidaRepo = connection.getCustomRepository(PartidaRepository);
    const timeRepo = connection.getCustomRepository(TimeRepository);

    const timesService = new TimeService(timeRepo, brasileiraoClient);
    const partidaService = new PartidaService(partidaRepo, timeRepo);
    const rodadaService = new RodadaService(brasileiraoClient, rodadaRepo, partidaService);
    const campeonatoService = new CampeonatoService(campeonatoRepo, timesService, rodadaService);

    const campeonato = await campeonatoRepo.findBySlug("brasileirão-2021");
    await campeonatoService.atualizarDadosCampeonato(campeonato);
};