import { EnderecoClient } from "../clients/EnderecoClient";
import { AxiosHttpClient } from "../infra/http/AxiosHttpClient";

export const buscaEnderecoPeloCep = async (cep: string) => {
  const httpClient = new AxiosHttpClient();
  const enderecoClient = new EnderecoClient(httpClient);
  const response = await enderecoClient.buscaEnderecoPorCep(cep);
  console.log(response)
};
