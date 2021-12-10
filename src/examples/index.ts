import { Connection } from 'typeorm';
import {
  criaUsuario,
  autenticaUsuario,
  alteraUsuario,
  alteraSenha
} from './UsuarioExample';
import { atualizarCampeonato, criarCampeonato } from './CampeonatoExample';
import { atualizarClassificacao, atualizarPontuacao, criarApostas } from './ApostaExample';

export const runner = async (connection: Connection) => {
  // await criarCampeonato(connection);
  // await atualizarCampeonato(connection);
  // await criarApostas(connection);
  // await atualizarPontuacao(connection);
  await atualizarClassificacao(connection);
  // await criaUsuario(connection);
  // await autenticaUsuario(connection);
  // await alteraUsuario(connection);
  // await alteraSenha(connection);
}; 