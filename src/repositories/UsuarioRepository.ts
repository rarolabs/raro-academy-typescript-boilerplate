import { IUsuarioRepository } from "../@types/repositories/IUsuarioRepository";
import { Usuario } from "../models/UsuarioEntity";
import { EntityRepository, Repository, UpdateResult } from "typeorm";
import { UsuarioAtualizarBancoDTO } from "../@types/dto/UsuarioDto";

@EntityRepository(Usuario)
export class UsuarioRepository extends Repository<Usuario> implements IUsuarioRepository {
    findByLogin(loginFind: string): Promise<Usuario> {
        return this.findOne({
            where: { login: loginFind }
        });
    }

    findUsuarioById(idFind: number): Promise<Usuario> {
        return this.findOne({
            where: { id: idFind }
        });
    }

    findByLoginComTipo(loginFind: string): Promise<Usuario> {
        return this.findOne({
            relations: ['tipoUsuario'],
            where: { login: loginFind }
        });
    }

    updateUsuario(usuarioAtualizarBancoDto: UsuarioAtualizarBancoDTO, id: number): Promise<UpdateResult> {
        return this.update(id, usuarioAtualizarBancoDto);
    }

    saveUsuario(usuario: Usuario): Promise<Usuario> {
        return this.save(usuario);
    }
}