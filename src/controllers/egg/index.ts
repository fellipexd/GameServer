import { Server, Socket } from "socket.io";
import RedisService from "../../services/redis";
import EggModel from "../../models/egg";
import EggEngine from "../../engines/egg"

class EggController {
    protected rs: RedisService;
    protected eggEngine: EggEngine;

    constructor() {
        this.rs = new RedisService();
        this.eggEngine = new EggEngine();
    }

    public async createEgg(data: string, io: Server, socket: Socket) {
        try {
            const user = await this.rs.user.getUser(socket.data.user)
            const egg = await EggModel.create({ type: 1, countDown: 30, account: user.id });

            await this.rs.eggs.setEgg(socket.data.user, egg.toJSON());

            socket.emit(`my-safe-room/create-egg`, JSON.stringify(egg.toJSON()));

            this.eggEngine.CountDown(egg.toJSON(), io, socket);
        } catch (e) {
            console.log(e)
        }
    }
}

export default EggController;