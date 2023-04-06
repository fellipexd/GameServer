import RedisService from "../services/redis";
import { Server, Socket } from "socket.io";
import EggModel from "../models/egg";
import GameEngine from "../services/game-engine";

class EggEngine extends GameEngine {
    constructor() {
        super();
    }

    public async CountDown(egg: any, io: Server, socket: Socket) {
        const rs = new RedisService();
        const routeName = `my-safe-room/count-down`;

        let time = egg.countDown;

        this.Update({ time: 1, type: 'second' }, async() => {
            socket.emit(routeName, JSON.stringify({ countDown: time }));
            egg.countDown = time;
            await rs.eggs.setEgg(socket.data.user, egg);
            time--;
        })
        
        await rs.eggs.delEgg(socket.data.user, egg.id);

        await EggModel.update({ hatched: true, countDown: 0 }, { where: { id: egg.id } })

        socket.emit(routeName, JSON.stringify({ countDown: time, hatched: true }));
    }

}

export default EggEngine;