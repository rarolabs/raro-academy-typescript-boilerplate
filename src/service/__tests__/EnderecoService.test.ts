import { EnderecoDTO } from '../../@types/dtos/api-cep/EnderecoDTO';
import * as faker from 'faker';
import { EnderecoService } from '../../service/EnderecoService';
import { EnderecoRepository } from '../../repositories/EnderecoRepository';
import { EnderecoClient } from '../../clients/EnderecoClient';
import { AxiosHttpClient } from '../../infra/http/AxiosHttpClient';
import { Endereco } from '../../models/EnderecoEntity';

describe("EnderecoService", () => {
    let enderecoDTO: EnderecoDTO;
    let enderecoObj: Endereco;

    let fakerCep: string;
    let fakerNumero: string;

    let httpClient: AxiosHttpClient;
    let enderecoClient: EnderecoClient;
    let enderecoRepo: EnderecoRepository;
    let enderecoService: EnderecoService;

    beforeEach(() => {
        fakerCep = faker.address.zipCode();
        fakerNumero = faker.random.alphaNumeric(3);

        enderecoDTO = {
            cep: fakerCep,
            logradouro: faker.address.streetName(),
            complemento: faker.address.stateAbbr(),
            bairro: faker.address.secondaryAddress(),
            localidade: faker.address.country(),
            uf: faker.address.state(),
            ibge: faker.address.direction(),
            gia: faker.address.latitude(),
            ddd: faker.address.longitude(),
            siafi: faker.address.stateAbbr(),
        }

        enderecoObj = new Endereco();
        enderecoObj.cep = fakerCep;
        enderecoObj.numero = fakerNumero;
        enderecoObj.bairro = enderecoDTO.bairro;
        enderecoObj.logradouro = enderecoDTO.logradouro;
        enderecoObj.estado = enderecoDTO.uf;

        enderecoRepo = new EnderecoRepository()
        httpClient = new AxiosHttpClient;
        enderecoClient = new EnderecoClient(httpClient);
        enderecoService = new EnderecoService(enderecoRepo, enderecoClient);
    });

    beforeEach(jest.clearAllMocks);
    describe("buscarCep", () => {
        it("Deve retornar um erro caso não consiga buscar dados na API", async () => {
            jest.spyOn(enderecoClient, 'buscaEnderecoPorCep').mockRejectedValue(new Error("Erro ao buscar endereco na api"));

            await expect(enderecoService.buscarCep(fakerCep, fakerNumero)).rejects.toThrow();
        });
        it("Deve retornar um erro caso não consiga salvar os dados no banco", async () => {
            jest.spyOn(enderecoClient, 'buscaEnderecoPorCep').mockResolvedValue(enderecoDTO);
            jest.spyOn(enderecoRepo, "save").mockRejectedValue(new Error("Erro ao salvar dados no banco"));

            await expect(enderecoService.buscarCep(fakerCep, fakerNumero)).rejects.toThrow();
        });
        it("Deve salvar um endereço corretamente após busca-lo em uma API externa", async () => {
            jest.spyOn(enderecoClient, 'buscaEnderecoPorCep').mockResolvedValue(enderecoDTO);
            jest.spyOn(enderecoRepo, "save").mockResolvedValue(enderecoObj);

            await expect(enderecoService.buscarCep(fakerCep, fakerNumero)).resolves.toEqual(enderecoObj);
            expect(enderecoClient.buscaEnderecoPorCep).toHaveBeenCalledWith(fakerCep);
            expect(enderecoRepo.save).toHaveBeenCalled();
        });
    });
});