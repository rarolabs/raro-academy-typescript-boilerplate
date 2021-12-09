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
  loguin: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
    length: 500,
  })
  hashsenha: string;

  @Column({
    nullable: false,
    unique: true,
  })
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @ManyToMany(() => TipoUsuario, (tipoUsuario) => tipoUsuario.usuarios)
  tipoUsario: TipoUsuario;
}
