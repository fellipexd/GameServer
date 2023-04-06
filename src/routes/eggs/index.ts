import { Server, Socket } from "socket.io";
import EggController from '../../controllers/egg'
import RoutesGeneric from "../../utils/routes";

class EggsRoutes extends RoutesGeneric {
    constructor() {
        super();
    }

    public async createEgg(io: Server, socket: Socket) {
        socket.on('create-egg', (data) => new EggController().createEgg(data, io, socket))
    }
}

export default EggsRoutes;