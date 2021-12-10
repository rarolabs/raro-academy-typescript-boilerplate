import { Time } from "../models/TimeEntity"
import { EntityRepository, Repository } from "typeorm"
import { ITimeRepository } from "./ITimeRepository"

@EntityRepository(Time)
export class TimeRepository extends Repository<Time> implements ITimeRepository {
    async findByNome(nomeTime: string): Promise<Time> {
        return await this.findOne({where: { nome: nomeTime } });
    }
    async criar(time: Time): Promise<Time> {
        return await this.save(time);
    }
}