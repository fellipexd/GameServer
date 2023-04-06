import RedisService from "../services/redis";
import { Socket, Server } from "socket.io";

class SocketIO {
    public io: Server;
    public socket: Socket;
    // protected rs: RedisService;

    constructor(io: Server, socket: Socket) {
        this.io = io;
        this.socket = socket;
        // this.rs = new RedisService();
    }
}

export default SocketIO;