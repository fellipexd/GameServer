import { Server, Socket } from "socket.io";
import RedisService from "../../services/redis/user";
import SocketIO from "../../socket/socket-io";

class AuthController extends SocketIO {
    constructor(io: Server, socket: Socket) {
        super(io, socket)
        this.startListening();
    }

    async startListening() {
        this.enterWorld();
    }

    enterWorld() {
        this.socket.emit("enter-world", this.socket.id);
    }

    disconnect() {
        this.socket.on('disconnect', (data: string) => {
            const rs = new RedisService()
            console.log('Bye, client ' + this.socket.id + ' ' + data);
            rs.delUser(this.socket.id)
        });
    }
}

export default AuthController;