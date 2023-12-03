import express from 'express';
import errorHandler from './middleware/errorhandler';
import { getDivisibleNumbers } from './service/divisible_numbers';
import rateLimit from './middleware/rateLimit';
import { WebSocketService } from './service/websocket/webSocket';
import { WebSocketServerService } from './service/websocket/webSocketServer';
import { OhlcChannelDataset } from './ohlcChannelDataset';

const app = express();
const port = 3000;

app.get('/data', rateLimit(), getDivisibleNumbers);
app.use(errorHandler());

const server = app.listen(port, () => console.log(`Listening on ${port}`));
const ohlcChannelDataset = new OhlcChannelDataset();
const socketServerService = new WebSocketServerService(
  server,
  ohlcChannelDataset,
);
socketServerService.initSocketServer();
const socketService = new WebSocketService(
  socketServerService,
  ohlcChannelDataset,
);
socketService.initBitstampSockets();
