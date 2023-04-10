import RedisService from "../services/redis";
import { Server, Socket } from "socket.io";
import EggModel from "../models/egg";
import GameEngine from "../services/game-engine";
import MonsterEngine from "./monster";
import { Op } from "sequelize";
import AccountModel from "../models/account";
import sequelize from '../config/postgres';
import Debug from 'debug'
import { delay } from "../utils/time";


class EggEngine extends GameEngine {
    log: Debug.Debugger;

    constructor() {
        super();
        this.log = Debug('EggEngine::')
    }

    public async InstanteAllActiveEggs(): Promise<number> {
        try {
            const rs = new RedisService();

            const [results] = await sequelize.query(`select e.*, a.name as ownerName from eggs e 
            join accounts a on e."accountId" = a.id 
            where e."countDown" > 0 
            and hatched = false`);

            results?.map((egg: any) => {
                rs.eggs.setEgg({
                    name: egg.ownerName,
                    id: egg.accountId
                },
                    egg)
            })

            return results?.length
        } catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    public async EggsUpdate(io: Server) {
        try {
            const rs = new RedisService();
            const activeEggs = await rs.eggs.getAllActiveEggs();
            activeEggs?.map(egg => {
                this.CountDown(io, egg, rs)
            })
        } catch (err) {
            throw new Error(JSON.stringify(err))
        }
    }

    public async CountDown(io: Server, egg: any, rs: RedisService) {
        try {
            let running = true;
            const user = { id: egg.accountId, name: egg.ownerName };
            let countDown = egg.countDown;

            while (running) {
                if (countDown >= 0) {
                    io.to(`my-safe-room/count-down`).emit(JSON.stringify({ countDown: countDown }));
                    await rs.eggs.setEgg(user, {...egg, count_down: countDown});
                    countDown--;

                    if (countDown.toString().includes([0])) {
                        const resp = await EggModel.update({ countDown }, { where: { id: egg.id } })
                    }
                }

                if (countDown < 1) {
                    running = false;
                    egg.hatched = true;
                    countDown = 0;

                    new MonsterEngine().Create(egg);

                    rs.eggs.delEgg(user, egg.id);
                    await EggModel.update({ hatched: egg.hatched, countDown }, { where: { id: egg.id } })
                }
                await delay(1, 'second')
            }
        } catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    // public async CountDown(egg: any, io: Server, socket: Socket) {
    //     const rs = new RedisService();
    //     const routeName = `my-safe-room/count-down`;

    //     let time = egg.countDown;

    //     this.Update({ time: 1, type: 'second' }, async () => {
    //         socket.emit(routeName, JSON.stringify({ countDown: time }));
    //         egg.countDown = time;
    //         await rs.eggs.setEgg(socket.data.user, egg);
    //         time--;
    //     })

    //     rs.eggs.delEgg(socket.data.user, egg.id);

    //     await EggModel.update({ hatched: true, countDown: 0 }, { where: { id: egg.id } })

    //     socket.emit(routeName, JSON.stringify({ countDown: time, hatched: true }));

    //     new MonsterEngine().create(io, socket);
    // }

}

export default EggEngine;