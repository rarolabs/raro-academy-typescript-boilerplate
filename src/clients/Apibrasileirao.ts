import { Tabela, Rodada } from "../@types/dto/ApiBrasileiraoDto";
import axios from "axios";

const brasieiraoApi = axios.create({
  baseURL:
    "https://us-central1-small-talk-3972f.cloudfunctions.net/v1/v1/campeonatos/10",
});


export class APIBrasileirao {
  private readonly token: string;

  public constructor(token: string) {
    this.token = token;
  }

  getTable(): Promise<Tabela[]> {
    return brasieiraoApi
      .get<Tabela[]>("tabela", {
        headers: {
          Authorization: `bearer ${this.token}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        if (error instanceof Error) {
          throw new Error(`Fallha ao acessar API ${error.message}`);
        } else {
          throw error;
        }
      });
  }

  getRodadas(): Promise<unknown> {
    return brasieiraoApi
      .get("rodadas", {
        headers: {
          Authorization: `bearer ${this.token}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        if (error instanceof Error) {
          throw new Error(`Falha ao acessar API ${error.message}`);
        } else {
          throw error;
        }
      });
  }

  getNumeroRodada(numeroRodada: string): Promise<Rodada> {
    return brasieiraoApi
      .get<Rodada>(`rodadas/${numeroRodada}`, {
        headers: {
          Authorization: `bearer ${this.token}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        if (error instanceof Error) {
          throw new Error(`Falha ao acessar API ${error.message}`);
        } else {
          throw error;
        }
      });
  }
}
