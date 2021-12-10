import { TabelaDTO, RodadaDTO, CampeonatoDTO } from "../@types/dtos/brasileicaoClientDTO";
import axios from "axios"

export default class BrasileiraoClient {
    public async getTabelaAPI(idCampeonato: number): Promise<TabelaDTO[]> {
        try {
            const tabela = await axios.get<TabelaDTO[]>(`${process.env.URL_BRASILEIRAO}/${idCampeonato}/tabela`, {
                headers: {Authorization: `bearer ${process.env.TOKEN}`},
            });
            return tabela.data;
        } catch (error) {
            throw new Error(`Falha ao buscar times na API. Motivo: ${error.message}`);
        }
    }

    public async getRodadasAPI(numeroRodada: number, idCampeonato: number): Promise<RodadaDTO> {
        try {
            const response = await axios.get<RodadaDTO>(`${process.env.URL_BRASILEIRAO}/${idCampeonato}/rodadas/${numeroRodada}`, {
                headers: {Authorization: `bearer ${process.env.TOKEN}`},
            });
            return response.data;
        } catch (error) {
            throw new Error("Falha ao buscar detalhes da rodada na API.");
        }
    }

    public async getDadosCampeonatoAPI(idCampeonato: number): Promise<CampeonatoDTO[]> {
        try {
            const campeonatoResponse = await axios.get<CampeonatoDTO[]>(`${process.env.URL_BRASILEIRAO}/${idCampeonato}/rodadas/`, {
                headers:{Authorization: `bearer ${process.env.TOKEN}`}
            });
            
            return campeonatoResponse.data;
        } catch (error) {
            throw new Error(`Falha ao buscar dados sobre o campeonato na API. Motivo ${error.message}`);
        }
    }
}

export { BrasileiraoClient }