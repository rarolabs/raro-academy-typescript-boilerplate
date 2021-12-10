import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Partida } from "./PartidaEntity";

@Entity()
export class Time {
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
    sigla: string;

    @Column({ 
        nullable: false,
        length: 500 
    })
    escudo: string;

    @OneToMany(() => Partida, partida => partida.mandante)
    partidasMandante: Partida[];
    
    @OneToMany(() => Partida, partida => partida.visitante)
    partidasVisitante: Partida[];
}
