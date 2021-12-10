import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { TipoUsuario } from "./TipoUsuarioEntity";

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  login: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
    length: 500,
  })
  hashSenha: string;

  @Column({
    nullable: false,
    unique: true,
  })
  firstName: string;

  @Column({ nullable: false, unique: true })
  lastName: string;

  @Column({ nullable: false, unique: true })
  age: number;

  @ManyToMany(() => TipoUsuario, (tipoUsuario) => tipoUsuario.usuarios)
  tipoUsuario: TipoUsuario;
}
