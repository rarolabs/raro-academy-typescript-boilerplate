import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Aposta } from "./ApostaEntity";
import { Rodada } from "./RodadaEntity";
import { Time } from "./TimeEntity";

@Entity()
export class Partida {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ 
        nullable: false,
        length: 50 
    })
    placar: string;

    @ManyToOne(() => Time, time => time.partidasMandante)
    mandante: Time;

    @ManyToOne(() => Time, time => time.partidasVisitante)
    visitante: Time;

    @Column({ 
        nullable: true
    })
    placarMandante: number;

    @Column({ 
        nullable: true
    })
    placarVisitante: number;

    @Column({ 
        nullable: false,
        length: 50 
    })
    status: string;

    @Column({ 
        nullable: false,
        length: 50 
    })
    slug: string;

    @Column({ 
        nullable: true 
    })
    dataRealizacao: Date;

    @OneToMany(() => Aposta, aposta => aposta.partida)
    apostas: Aposta[];

    @ManyToOne(() => Rodada, rodada => rodada.partidas)
    rodada: Rodada;
}