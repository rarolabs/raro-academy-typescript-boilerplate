import { createHmac } from "crypto";

export const getHashSenha = (senha: string): string => {
  const { CRYPTO_ALGORITHM, SECRET } = process.env;
  return createHmac(CRYPTO_ALGORITHM, SECRET).update(senha).digest('hex');
};
