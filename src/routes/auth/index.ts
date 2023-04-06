import RedisService from "../../services/redis";
import RoutesGeneric from "../../utils/routes";
import { Server, Socket } from "socket.io";

class AuthRoutes extends RoutesGeneric {
    constructor() { 
        super()
    }

    async disconnect(io: Server, socket: Socket) {
        socket.on("disconnecting", (reason) => {
            const rs = new RedisService()
            rs.user.delUser(socket.data.user)
            console.log('disconnecting: ' + socket.data.user.name)
        });
    }
}

export default AuthRoutes;