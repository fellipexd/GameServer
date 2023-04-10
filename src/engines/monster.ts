import { io } from "../main";
import MonsterModel from "../models/monster";
import RedisService from "../services/redis";
import sequelize from '../config/postgres';
import { Server, Socket } from "socket.io";
import { delay } from "../utils/time";

class MonsterEngine {
    constructor() {

    }

    public async Create(egg: any) {
        try {
            const rs = new RedisService();

            const monster = await MonsterModel.create({
                happiness: 1,
                health: 1,
                eggId: egg.id,
                accountId: egg.accountId,
            })

            await rs.monster.setMonster({
                name: egg.ownerName,
                id: egg.account
            },
                monster.toJSON());

            io.to(`my-safe-room/new-monster`).emit(monster.toJSON());
        } catch (error) {
            throw new Error(JSON.stringify(error));
        }
    }

    public async MonstersUpdate() {
        try {
            const rs = new RedisService();
            const activeMonsters = await rs.monster.getAllActiveMonsters();

            activeMonsters?.map(monster => {
                this.controlHunger(monster, rs);
            })

        } catch (error) {
            throw new Error(JSON.stringify(error));
        }
    }

    public async controlHunger(monster: any, rs: RedisService) {
        try {
            let food: number = Number(monster.food);
            let life: number = Number(monster.life);
            let deadTrigger: boolean = false;

            while (monster.alive && !deadTrigger) {
                if (food >= 0) {
                    food = await this.reduceFood(monster, food, rs)
                } else if (life >= 0 && food <= 0) {
                    life = await this.reduceLife(monster, life, rs)
                } else if (!deadTrigger) {
                    deadTrigger = await this.imDead(monster, rs)
                }
            }
        } catch (error) {
            console.log(error)
            throw new Error(JSON.stringify(error));
        }
    }

    private async reduceFood(monster: any, food: number, rs: RedisService) {
        try {
            rs.monster.updateFields(
                {
                    id: monster.accountId,
                    name: monster.ownerName
                },
                monster.id,
                { food: Number(food.toFixed(2)) }
            );
            await delay(1, 'second');
            return food - 1;
        } catch (error) {
            throw new Error(JSON.stringify(error));
        }
    }

    private async reduceLife(monster: any, life: number, rs: RedisService) {
        try {
            rs.monster.updateFields(
                {
                    id: monster.accountId,
                    name: monster.ownerName
                },
                monster.id,
                { life: life }
            );
            await delay(1, 'second');
            return life - 1;
        } catch (error) {
            throw new Error(JSON.stringify(error));
        }
    }

    private async imDead(monster: any, rs: RedisService) {
        rs.monster.updateFields(
            {
                id: monster.accountId,
                name: monster.ownerName
            },
            monster.id,
            { alive: false }
        );
        return true;
    }

    public async InstanteAllActiveMonsters(): Promise<number> {
        try {
            const rs = new RedisService();

            const [results] = await sequelize.query(`select m.*, a.name as ownerName from monsters m join accounts a on m."accountId" = a.id where m.alive = true`);

            results?.map((monster: any) => {
                rs.monster.setMonster({
                    name: monster.ownerName,
                    id: monster.accountId
                },
                    monster)
            })

            return results?.length
        } catch (err) {
            console.log(err)
            throw new Error(JSON.stringify(err));
        }
    }
}

export default MonsterEngine;