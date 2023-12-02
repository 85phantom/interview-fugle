import { WebSocket, WebSocketServer } from 'ws';
import { SocketChannel, SocketMessage } from './schema/websocketServer';

export class WebSocketServerService {
  public wss: WebSocketServer;
  public socketChannelList: SocketChannel[];

  constructor(server) {
    this.wss = new WebSocketServer({ server, path: '/streaming' });
    this.socketChannelList = [];
  }
  public initSocketServer() {
    this.wss.on('connection', (ws, req) => {
      console.log('Client connected');

      ws.on('message', (m) => {
        const message = JSON.parse(m.toString()) as SocketMessage;
        const { event, data } = message;
        this.updateSocketChannelListByEvent(event, data, ws);
      });

      //當 WebSocket 的連線關閉時執行
      ws.on('close', () => {
        console.log('Close connected');
      });
    });
  }

  public getSocketChannelList(): SocketChannel[] {
    return this.socketChannelList;
  }

  private updateSocketChannelListByEvent(
    event: string,
    data: { channels: string[] },
    websocket: WebSocket,
  ) {
    if (event === 'subscribe') {
      this.subscribeChannel(data.channels, websocket);
    } else if (event === 'unsubscibe') {
      this.unsubscribeChannel(data.channels);
    }
  }

  private subscribeChannel(channels: string[], ws: WebSocket) {
    channels.forEach((channel) => {
      this.socketChannelList.push({
        socket: ws,
        channel: `live_trades_${channel}`,
      });
    });
  }
  private unsubscribeChannel(channels: string[]) {
    channels.forEach((channel) => {
      this.removeSubscribeChannel(channel);
    });
  }
  private removeSubscribeChannel(channel: string) {
    const socketChannel = this.socketChannelList.filter(
      (e) => e.channel === `live_trades_${channel}`,
    )[0];
    const index = this.socketChannelList.indexOf(socketChannel);
    this.socketChannelList.splice(index, 1);
  }
}
