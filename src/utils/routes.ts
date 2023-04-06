import { Server } from "socket.io";

class RoutesGeneric {
    public getPropertyNames<T>(reference: T) {
        return Object.getOwnPropertyNames (Object.getPrototypeOf (reference))
        //@ts-ignore
        .filter(propName => (propName !== 'constructor' && propName !== 'getPropertyNames' && typeof this[propName] === 'function'))
    }
}

export default RoutesGeneric;