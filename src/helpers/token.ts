import { sign } from 'jsonwebtoken';
import { TokenPayload } from "../@types/dtos/usuarioDto";

export const generateJwtToken = (tokenPayload: TokenPayload, tempoParaExpiracao: string) => {
  return sign(
    tokenPayload,
    process.env.AUTH_SECRET,
    { expiresIn: tempoParaExpiracao }
  );
};