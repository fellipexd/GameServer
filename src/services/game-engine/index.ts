import { delay, typeTime } from "../../utils/time";

interface IUpdateDelay {
    time?: number, 
    type?: typeTime
}

interface IUpdate {
    start?: boolean;
    delay?: IUpdateDelay;
}

interface IRulesEngine {
    update?: IUpdate;
}

class GameEngine {
    rulesEngine: IRulesEngine;

    constructor(rulesEngine?: IRulesEngine) { 
        this.rulesEngine = rulesEngine ?? rulesEngineInitialValue

        this.StartUpdate();
    }

    private async StartUpdate(): Promise<void> {
        while (this.rulesEngine.update?.start) {
            this.Update();
            await delay(1, 'second')
        }
    }

    public async Update(option?: IUpdateDelay, callback?: Function): Promise<void> {
        while (typeof option?.time === 'number') {
            callback && callback()
            await delay(option.time, option?.type ?? 'ms')
        }
    }
}

export default GameEngine;

const rulesEngineInitialValue = {
    update: {
        start: false,
        delay: {time: 0, type: 'ms' as typeTime},
    },
}
