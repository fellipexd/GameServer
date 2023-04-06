import { Server, Socket } from "socket.io";
import RoutesGeneric from "./routes";

function RoutesMap<T extends any>(routes: Array<T>, io: Server, socket: Socket) {
    routes.forEach((Route: any) => {
        const newInstanteClass = new Route()
        newInstanteClass.getPropertyNames(newInstanteClass)
        .forEach((method: string) => {
            //@ts-ignore
            newInstanteClass[method] && newInstanteClass[method](io, socket)
        })
    })
}

export default RoutesMap;