import express from "express";
import AccountModel, { AccountDTO } from './models/account';
import { Server, Socket } from "socket.io";
import http from 'http';
import RedisService from './services/redis'
import RoutesMap from "./utils/routesMap";
import routes from "./routes/";
import jwt from 'jsonwebtoken';

interface SocketUser {
	id: number
	name: string
	mail: string
}

interface SocketData {
	user: SocketUser
}

const app = express();
const port = 3000;

const httpServer = http.createServer(app);

const io = new Server<SocketData>(httpServer, {
	cors: {
		origin: '*'
	}
});

app.use(express.json())

//TODO: Move to folder in future
app.post('/sign-in', async (req: any, res: any) => {
	try {
		const account = await AccountModel.findOne({
			where: { mail: req.body.mail }
		}) as AccountDTO | null

		if (!account) { throw 'AccountNotFound' }

		const accountDTO = account && new AccountDTO(account)
		accountDTO?.password && delete accountDTO.password

		const rs = new RedisService()
		rs.user.setUser(accountDTO, accountDTO)
		const user = await rs.user.getUser(accountDTO)

		const token = jwt.sign(user, 'ABCD', {
			expiresIn: "1 day"
		})

		res.send({...user, token})
	} catch (err) {
		console.log(err);
	}
})

httpServer.listen(port, () => {
	console.log(`Server listening at port ${port}`);
});

io.on('connection', async(s: Socket) => {
	jwt.verify(s.handshake.headers?.token as string, 'ABCD', (err, decoded) => {
		if (err) { 
			s.disconnect(true)
			return 
		}
		s.data.user = decoded
		RoutesMap(routes, io, s)
	})
});