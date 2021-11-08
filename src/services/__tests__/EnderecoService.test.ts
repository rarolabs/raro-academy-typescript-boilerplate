import * as faker from 'faker';
import { CepClient } from '../../clients/CepClient';
import { EnderecoService } from '../../services/EnderecoService';
import { EnderecoDto } from '../../@types/dto/EnderecoDto';

const resultadoApiCepFactory = (): EnderecoDto => ({
  cep: faker.address.zipCode(),
  logradouro: faker.lorem.sentence(),
  complemento: faker.lorem.sentence(),
  bairro: faker.lorem.word(),
  localidade: faker.lorem.sentence(),
  uf: faker.lorem.sentence(),
  ibge: faker.lorem.sentence(),
  gia: faker.lorem.sentence(),
  ddd: faker.lorem.sentence(),
  siafi: faker.lorem.sentence(),
});

describe('EnderecoService', () => {
  let cepClient: CepClient;
  let enderecoService: EnderecoService;

  const oldEnv = process.env;
  beforeEach(() => {
    process.env.CRYPTO_ALGORITHM = 'SHA256';
    process.env.SECRET = faker.datatype.uuid();
    process.env.AUTH_SECRET = faker.datatype.uuid();
  });
  afterEach(() => {
    process.env = oldEnv;
  });

  beforeEach(() => {
    cepClient = new CepClient(null);
    enderecoService = new EnderecoService(
      cepClient
    )
  })

  beforeEach(jest.clearAllMocks);

  it('deve buscar um endereço através do CEP', async () => {
    const endereco: EnderecoDto = resultadoApiCepFactory();
    jest.spyOn(cepClient, 'buscaEnderecoPorCEP').mockResolvedValue(endereco);

    const cep = faker.address.zipCode();
    await enderecoService.buscaPorCep(cep);

    expect(cepClient.buscaEnderecoPorCEP).toHaveBeenCalledWith(cep);
  });
});
