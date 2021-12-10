export interface UsuarioDTO {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  ativo?: boolean;
}

export type AlterarUsuarioDTO = {
  nome?: string;
  email?: string;
  senha?: string;
  hashSenha?: string;
  ativo?: boolean;
}

export type AutenticaUsuarioDTO = Pick<UsuarioDTO, 'email' | 'senha'>;
export type UsuarioCriadoDTO = Omit<UsuarioDTO, 'senha'>;
export type TokenPayload = Omit<UsuarioDTO, 'senha'>;
export type RetornoAutenticacao = TokenPayload & { token?: string };
export type CriaUsuarioDTO = Omit<UsuarioDTO, 'id'>;