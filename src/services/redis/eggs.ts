import { sf } from '../../utils/json';
import { redis } from '../../config/redis';
import { ISetUser, userDTO } from './user';
import { base64Encode } from '../../utils/crypto';
import EggModel from '../../models/egg';

interface IEgg {
    id: number;
    type: number;
}

class RedisEggsService {
    async getAllActiveEggs() {
        try {
            const keys = await redis.multi().keys('eggs:*').exec();
            const filtredEggs: Array<any> = [];
            
            //@ts-ignore
            await Promise.all(keys[0]?.map(async(key: any) => {
                const eggJson = await redis.get(key);
                if (!eggJson) { return }

                const unfiltredEgg = JSON.parse(eggJson);

                if (unfiltredEgg.countDown <= 0 && unfiltredEgg?.hatched) { return }

                filtredEggs.push(unfiltredEgg)
            }))

            return filtredEggs;
        } catch (e) {
            console.log(e)
            throw e;
        }
    }

    async setEgg<T extends IEgg>(user: ISetUser, value: T): Promise<void> {
        try {
            await redis.set(`eggs:${base64Encode(userDTO(user, { eggId: value.id }))}`, this.eggDTO(value));
        } catch (e) {
            throw e;
        }
    }

    async getEgg(user: ISetUser, eggId: string): Promise<void> {
        try {
            await redis.get(`eggs:${base64Encode(userDTO(user, { eggId }))}`);
        } catch (e) {
            throw e;
        }
    }

    async delEgg(user: ISetUser, eggId: string): Promise<void> {
        try {
            await redis.del(`eggs:${base64Encode(userDTO(user, { eggId }))}`);
        } catch (e) {
            throw e;
        }
    }

    async getAllEggsByUser(user: ISetUser): Promise<Array<unknown>> {
        try {
            const eggIds = await EggModel.findAll({
                where: {
                    account: user.id,
                },
                attributes: ['id']
            })

            const eggs = await Promise.all(eggIds?.map(async (egg: any) => {
                const newEgg = await redis.get(`eggs:${base64Encode(userDTO(user, { eggId: egg.id }))}`)
                return newEgg && JSON.parse(newEgg)
            }))

            return eggs

        } catch (e) {
            throw e;
        }
    }

    async delAllEggsBySocket(user: ISetUser): Promise<void> {
        try {
            await redis.del(`eggs:${base64Encode(userDTO(user))}`);
        } catch (e) {
            throw e;
        }
    }

    async delOneEggsByIdAndUser<T>(user: ISetUser, value: Array<T>): Promise<void> {
        try {
            if (!value?.length) {
                this.delAllEggsBySocket(user);
                return;
            }
            await redis.set(`eggs:${base64Encode(userDTO(user))}`, JSON.stringify(value));
        } catch (e) {
            throw e;
        }
    }

    private eggDTO(value: any) {
        delete value.createdAt;
        delete value.updatedAt;
        return JSON.stringify(value)
    }
}

export default RedisEggsService;