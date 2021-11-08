import * as faker from 'faker';
import { UserRepository } from '../../repositories/UserRepository';
import { UserService } from '../../services/UserService';
import { UserDTO } from '../../@types/dto/UserDto';

describe('UserService', () => {
  let userDto: UserDTO;
  let userRepository: UserRepository;
  let userService: UserService;

  beforeEach(jest.clearAllMocks);
  beforeEach(() => {
    userDto = {
      id: faker.datatype.number(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      age: faker.datatype.number(),
    };
    userRepository = new UserRepository();
    userService = new UserService(userRepository);
  });


  describe('list', () => {
    it('deve listar os usuarios', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValue(null);
      await userService.listar();

      expect(userRepository.find).toHaveBeenCalled();
    });
  });

  describe('buscar', () => {
    it('deve buscar os usuarios', async () => {
      const id = faker.datatype.number();
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      await userService.buscar(id);

      expect(userRepository.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('criar', () => {
    it('deve criar um novo usuario', async () => {
      jest.spyOn(userRepository, 'save').mockResolvedValue(null);
      await userService.criar(userDto);
      expect(userRepository.save).toHaveBeenCalledWith(userDto);
    });
  });

  describe('atualizar', () => {
    it('deve atualizar um usuario', async () => {
      const id = faker.datatype.number();
      jest.spyOn(userRepository, 'save').mockResolvedValue(null);
      await userService.atualizar(id, userDto);
      expect(userRepository.save).toHaveBeenCalledWith({...userDto, id});
    });
  });

  describe('remover', () => {
    it('deve remover um usuario', async () => {
      const id = faker.datatype.number();
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(userDto);
      jest.spyOn(userRepository, 'remove').mockResolvedValue(null);
      await userService.remover(id);

      expect(userRepository.findOne).toHaveBeenCalledWith(id);
      expect(userRepository.remove).toHaveBeenCalledWith(userDto);
    });

    it('deve lançar um erro se o usuário nao for encontrado', async () => {
      const id = faker.datatype.number();
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'remove').mockResolvedValue(null);

      await expect(userService.remover(id)).rejects.toThrow(new Error('User not found!'));
      expect(userRepository.findOne).toHaveBeenCalledWith(id);
      expect(userRepository.remove).not.toHaveBeenCalledWith();
    });
  });
});
