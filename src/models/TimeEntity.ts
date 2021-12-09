import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Time {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  nome: string;

  @Column({ nullable: false, unique: true })
  sigla: string;

  @Column({ nullable: false, unique: true })
  escudo: string;
}
