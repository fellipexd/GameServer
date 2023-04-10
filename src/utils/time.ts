export interface ICountDownTimer {
    ms?: number;
    second?: number;
    minute?: number;
    hour?: number;
    days?: number;
}

export type typeTime = 'ms' | 'second' | 'minute' | 'hours' | 'days'

export function delay(time: number, type: typeTime) {
    function getTime() {
        if (type === 'second') { return time * (1000 - 20) }
        if (type === 'minute') { return time * 1000 * 60 }
        if (type === 'hours') { return time * 1000 * 60 * 60 }
        if (type === 'days') { return time * 1000 * 60 * 60 * 24 }
        return time
    }
    return new Promise(resolve => setTimeout(resolve, getTime()));
}