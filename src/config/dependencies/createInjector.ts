
import { getCustomRepository } from "typeorm";
import Container from "typedi";
import { UserRepository } from "../../repositories/UserRepository";

// inicializador de dependências:
// inicializa controllers
import "../../controllers/UserController";
import "../../controllers/EnderecoController";

// inicializa services
import "../../services/UserService";
import "../../services/EnderecoService";

// inicializa clientes
import "../../clients/CepClient"
import "../../infra/http/AxiosHttpClient";


const createDependencyInjector = () => {
  Container.set("UserRepository", getCustomRepository(UserRepository));
};

export default createDependencyInjector;
