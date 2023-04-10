import { redis } from '../../config/redis';
import { ISetUser, userDTO } from './user';
import { base64Encode } from '../../utils/crypto';

class RedisMonsterService {
    async setMonster(user: ISetUser, value: any) {
        try {
            await redis.set(`monsters:${base64Encode(userDTO(user, { monsterId: value.id }))}`, this.monsterDTO(value));
        } catch (error) {
            console.log(error)
            throw new Error(JSON.stringify(error));
        }
    }

    async getMonster(user: ISetUser, monsterId: string) {
        try {
            const response = await redis.get(`monsters:${base64Encode(userDTO(user, { monsterId }))}`);
            if (!response) { throw 'monsterNotFound' }
            return JSON.parse(response);
        } catch (error) {
            throw new Error(JSON.stringify(error));
        }
    }

    async updateFields(user: ISetUser, monsterId: string, value: Record<string, unknown>) {
        try {
            const monster = await this.getMonster(user, monsterId);
            redis.set(`monsters:${base64Encode(userDTO(user, { monsterId }))}`,
                this.monsterDTO({...monster, ...value})
            );
        } catch (error) {
            throw new Error(JSON.stringify(error));
        }
    }

    async getAllActiveMonsters() {
        try {
            const keys = await redis.multi().keys('monsters:*').exec();
            const filtredMonsters: Array<any> = [];

            //@ts-ignore
            await Promise.all(keys[0]?.map(async (key: any) => {
                const monsterJson = await redis.get(key);
                if (!monsterJson) { return }

                const unfiltredMonster = JSON.parse(monsterJson);

                if (!unfiltredMonster.alive) { return }

                filtredMonsters.push(unfiltredMonster)
            }))

            return filtredMonsters;
        } catch (error) {
            throw new Error(JSON.stringify(error));
        }
    }

    private monsterDTO(value: any) {
        delete value.createdAt;
        delete value.updatedAt;
        return JSON.stringify(value);
    }
}

export default RedisMonsterService;