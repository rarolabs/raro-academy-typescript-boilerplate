import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuario } from "./UsuarioEntity";

@Entity()
export class Campeonato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  nome: string;

  @Column({ nullable: false, unique: true })
  slug: string;

  @Column({ nullable: false, unique: true })
  nomePopular: string;

  @Column({ nullable: false, unique: true })
  status: string;

  @ManyToMany(() => Usuario)
  @JoinTable()
  usuarios: Usuario[];
}
