export type Times = {
  time_id: number;
  nome_popular: string;
};

export type Jogos = {
  partida_id: number;
  time_mandante: Times;
  time_visitante: Times;
  data_realizacao: string;
  placar_mandante: number;
  placar_visitante: number;
};

export type Rodada = {
  rodada: number;
  status: string;
  partidas: Jogos[];
};

export type Tabela = {
  time: Times;
};
