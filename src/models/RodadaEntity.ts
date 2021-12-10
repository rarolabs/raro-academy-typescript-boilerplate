import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Campeonato } from "./CampeonatoEntity";
import { Partida } from "./PartidaEntity";

@Entity()
export class Rodada {
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
        nullable: false 
    })
    rodada: number;

    @Column({ 
        nullable: false,
        length: 50 
    })
    status: string;

    @OneToMany(() => Partida, partida => partida.rodada, {cascade: true})
    partidas: Partida[];

    @ManyToOne(() => Campeonato, campeonato => campeonato.rodadas)
    campeonato: Campeonato;
}