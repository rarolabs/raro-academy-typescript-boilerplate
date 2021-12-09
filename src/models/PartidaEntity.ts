import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Rodada } from "./RodadaEntity";

@Entity()
export class Partida {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  placar: string;

  @Column({ nullable: false, unique: true })
  mandanteTime: string;

  @Column({ nullable: false, unique: true })
  visitanteTime: string;

  @Column({ nullable: false, unique: true })
  placarMandante: string;

  @Column({ nullable: false, unique: true })
  placarVisitante: string;

  @Column({ nullable: false, unique: true })
  status: number;

  @Column({ nullable: false, unique: true })
  slug: number;

  @Column({ nullable: false, unique: true })
  dataRealizacao: Date;

  @ManyToOne(() => Rodada, (rodada) => rodada.id)
  rodada: Rodada;
}
