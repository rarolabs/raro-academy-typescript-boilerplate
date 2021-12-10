import { Time } from "models/TimeEntity";

export interface ITimeRepository {
    findByNome(nome: string): Promise<Time>;
    save(time: Time[]): Promise<Time[]>;
}