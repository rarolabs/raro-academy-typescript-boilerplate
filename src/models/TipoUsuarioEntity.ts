import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./UsuarioEntity";

@Entity()
export class TipoUsuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  nome: string;

  @Column({
    nullable: false,
    unique: true,
  })
  nivelAcesso: string;

  @OneToMany(() => Usuario, (usuarios) => usuarios.tipoUsario)
  usuarios: Usuario[];
}
