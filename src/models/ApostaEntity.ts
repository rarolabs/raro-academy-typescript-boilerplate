import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./UsuarioEntity";

@Entity()
export class Aposta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  placarMandante: string;

  @Column({ nullable: false, unique: true })
  placarVisitante: string;

  @ManyToMany(() => Usuario, (usuario) => usuario.id)
  usuario: Usuario;
}
