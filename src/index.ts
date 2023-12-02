import express from 'express';
import errorHandler from './middleware/errorhandler';
import { getDivisibleNumbers } from './divisible_numbers';
import rateLimit from './middleware/rateLimit';
import { WebSocket, Server as SocketServer } from 'ws';
import { WebSocketService } from './webSocket';
import { WebSocketServerService } from './webSocketServer';

const app = express();
const port = 3000;

app.get('/data', rateLimit(), getDivisibleNumbers);
app.use(errorHandler());

const server = app.listen(port, () => console.log(`Listening on ${port}`));
const socketServerService = new WebSocketServerService(server);
socketServerService.initSocketServer();
const socketService = new WebSocketService(socketServerService);
socketService.initBitstampSockets();
