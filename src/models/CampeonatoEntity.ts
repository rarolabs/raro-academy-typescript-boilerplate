import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Rodada } from "./RodadaEntity";
import { Usuario } from "./UsuarioEntity";

@Entity()
export class Campeonato {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ 
        nullable: false,
        length: 50 
    })
    nome: string;

    @Column({ 
        nullable: false,
        length: 50 
    })
    slug: string;

    @Column({ 
        nullable: false,
        length: 50 
    })
    nomePopular: string;

    @Column({ 
        nullable: false,
        length: 50 
    })
    status: string;

    @Column({ 
        nullable: false,
        length: 500 
    })
    logo: string;

    @Column({
        unique: true
    })
    idCampeonatoApiExterna: number;

    @OneToMany(() => Rodada, rodada => rodada.campeonato)
    rodadas: Rodada[];
    
    @ManyToMany(() => Usuario, usuario => usuario.campeonatos)
    usuarios: Usuario[];
}