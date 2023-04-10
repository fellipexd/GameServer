import { Server } from "socket.io";
import EggEngine from "../../engines/egg";
import GameEngine from "../../services/game-engine";
import Debug from 'debug'
import { redis } from '../../config/redis';
import MonsterEngine from "../../engines/monster";

class WorldController {
    log: Debug.Debugger;
    eggEngine: EggEngine;
    monsterEngine: MonsterEngine;
    io: Server;

    constructor(io: Server) {
        this.log = Debug('WorldController::')
        this.io = io;
        this.eggEngine = new EggEngine();
        this.monsterEngine = new MonsterEngine();
        this.SyncProcess();
    }

    async SyncProcess() {
        try {
            await redis.flushDb();
            await this.InstanteWorld();
            await this.WorldUpdate();
        } catch (err) {
            console.log(err)
        }
    }

    async WorldUpdate() {
        try {
            this.eggEngine.EggsUpdate(this.io);
            console.log('Eggs update: OK');

            this.monsterEngine.MonstersUpdate();
            console.log('Monster update: OK');
        } catch (err) {
            console.log(err)
        }
    }

    async InstanteWorld() {
        try {
            const eggs = await this.eggEngine.InstanteAllActiveEggs();
            console.log('Instante eggs: ' + eggs);

            const monster = await this.monsterEngine.InstanteAllActiveMonsters();
            console.log('Instante monster: ' + monster);
        } catch (err) {
            throw new Error('InstanteWorld::' + JSON.stringify(err))
        }
    }
}

export default WorldController;