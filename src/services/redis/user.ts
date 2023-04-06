import { sf } from '../../utils/json';
import { redis } from '../../config/redis';
import { base64Encode } from '../../utils/crypto';

export interface ISetUser {
    id: string | number;
    name: string;
}

class RedisUserService {
    constructor() {  }
    async setUser<T>(user: ISetUser, value: T) {
        try {
		    const response = await redis.set(`user:${base64Encode(userDTO(user))}`, JSON.stringify(value));
            if (!response) { throw 'userNotFound' }
            return response;
        } catch (e) {
            throw e;
        }
    }

    async getUser(user: ISetUser) {
        try {
		    const response = await redis.get(`user:${base64Encode(userDTO(user))}`);
            if (!response) { throw 'userNotFound' }
            return JSON.parse(response);
        } catch (e) {
            throw e;
        }
    }

    async delUser(user: ISetUser) {
        try {
            console.log(user)
		    await redis.del(`user:${base64Encode(userDTO(user))}`);
        } catch (e) {
            throw e;
        }
    }
}

export function userDTO(user: ISetUser, options = {}) {
    return JSON.stringify({
        id: user.id,
        name: user.name,
        ...options
    })
}

export default RedisUserService;