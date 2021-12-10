import { PalpiteDto } from "../@types/dtos/palpiteDto";
import { IUsuarioRepository } from "repositories/IUsuarioRepository";
import { Aposta } from "../models/ApostaEntity";
import { IApostaRepository } from "../repositories/IApostaRepository";
import { IRodadaRepository } from "../repositories/IRodadaRepository";
import { IPartidaRepository } from "../repositories/IPartidaRepository";
import { IApostaService } from "./IApostaService";
import { gerarResultado } from "../helpers/resultado";
import { Usuario } from "../models/UsuarioEntity";
import { classificacaoDTO } from "../@types/dtos/classificacaoDTO";

export class ApostaService implements IApostaService {
    constructor(
        private apostaRepository: IApostaRepository,
        private usuarioRepository: IUsuarioRepository,
        private partidaRepository: IPartidaRepository,
        private rodadaRepository: IRodadaRepository,
        ) {}

    async gerarApostas(usuarioId: number, numeroRodada: number, palpites: PalpiteDto[]): Promise<void> {
        const usuario = await this.usuarioRepository.findById(usuarioId);
        const rodada = await this.rodadaRepository.findByNumeroRodada(numeroRodada);
        if (rodada.campeonato.status !== "ativo") {
            throw new Error("Você não pode apostar em um campeonato finalizado");
        }
        const usuarioRegistrado = usuario.campeonatos.some(campeonato => campeonato.id === rodada.campeonato.id);

        if (!usuarioRegistrado) {
            throw new Error("O Usuário não está registrado nesse campeonato e não pode fazer apostas");
        }

        const partidas = await this.partidaRepository.findbyRodadaId(rodada.id);

        const apostasPromise = palpites.flatMap(palpite => {
            return partidas.map(async partida => {
                const partidaApostada = await this.apostaRepository.findbyUsuarioAndPartida(usuario.id, partida.id);
                if (partidaApostada) {
                    return;
                }

                if (partida.id === palpite.partidaID) {
                    const aposta = new Aposta();
                    aposta.partida = partida;
                    aposta.usuario = usuario;
                    aposta.placarMandante = palpite.golsMandante;
                    aposta.placarVisitante = palpite.golsVisitante;
                    return this.apostaRepository.save(aposta);
                }
            })
        })
        await Promise.all(apostasPromise);
        return;
    }

    async atualizarPontuacao(): Promise<void> {
        const apostas = await this.apostaRepository.findAll();
        const apostasAtualizadas = apostas.map(aposta => {
            if (aposta.partida.status === "finalizado") {
                return this.calcularPontuacao(aposta);
            }
        })
        const apostasPromise = apostasAtualizadas.map(apostaAtualizada => {
            return this.apostaRepository.save(apostaAtualizada);
        })
        await Promise.all(apostasPromise);
        return;
    }

    async gerarClassificacao(): Promise<classificacaoDTO[]> {
        const apostas = await this.apostaRepository.findAll();
        console.log(apostas);
        const usuariosQueApostaram = await this.usuariosQueApostaram(apostas);
        const usuariosEPontuacao: classificacaoDTO[] = usuariosQueApostaram.map(usuario => {
            let pontuacao = 0;
            apostas.forEach(aposta => {
                console.log(aposta.usuario)
                if (usuario.id === aposta.usuario.id) {
                    pontuacao += aposta.pontos;
                }
            })
            return { usuario, pontuacao };
        })

        return usuariosEPontuacao.sort((a, b) => a.pontuacao - b.pontuacao);
    }

    private async usuariosQueApostaram(apostas: Aposta[]): Promise<Usuario[]> {
        const IdsUsuariosApostaram = apostas.map(aposta => aposta.usuario.id);
        const usuariosFiltrados = [...new Set(IdsUsuariosApostaram)];

        const usuariosPromise = usuariosFiltrados.map(usuarioFiltrado => {
            return this.usuarioRepository.findById(usuarioFiltrado);
        })
        return await Promise.all(usuariosPromise);
    }

    private calcularPontuacao(aposta: Aposta): Aposta {
        let pontos = 0;
        if (aposta.placarMandante === aposta.partida.placarMandante) {
            pontos += 3;
        }
        if (aposta.placarVisitante === aposta.partida.placarVisitante) {
            pontos += 3;
        }
        if (gerarResultado(aposta.placarMandante, aposta.placarVisitante) === gerarResultado(aposta.partida.placarMandante, aposta.partida.placarVisitante)) {
            pontos += 6;
        }
        aposta.pontos = pontos;
        return aposta;
    }
}