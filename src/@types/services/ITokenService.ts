import { UsuarioRetornoDTO } from "../../@types/dto/UsuarioDto";

export interface ITokenService {
  gerarToken(usuario: UsuarioRetornoDTO): string;
  verificarToken(token: string): UsuarioRetornoDTO;
}