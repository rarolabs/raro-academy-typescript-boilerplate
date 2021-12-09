import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Partida } from "./PartidaEntity";

@Entity()
export class Rodada {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  nome: string;

  @Column({ nullable: false, unique: true })
  slug: string;

  @Column({ nullable: false, unique: true })
  rodada: string;

  @Column({ nullable: false, unique: true })
  status: string;

  @OneToMany(() => Partida, (partida) => partida.id)
  partida: Partida[];
}
