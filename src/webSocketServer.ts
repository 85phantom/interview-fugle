import { WebSocket, WebSocketServer } from 'ws';
import { SocketChannel, SocketMessage } from './schema/websocketServer';
import _ from 'lodash';
import { WebSocketBadRequestError } from './error';
import { WebSocketResponse } from './schema/websocket';

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
    data: { channel: string },
    websocket: WebSocket,
    id: string,
  ) {
    if (event === 'subscribe') {
      this.subscribeChannel(data.channel, websocket, id);
    } else if (event === 'unsubscribe') {
      this.unsubscribeChannel(data.channel, websocket, id);
    }
  }

  private subscribeChannel(channel: string, ws: WebSocket, id: string) {
    this.socketChannelList.push({
      socket: ws,
      channel: `live_trades_${channel}`,
    });

    const response: WebSocketResponse = {
      event: 'subscription_succeeded',
      channel: channel,
      data: {},
    };

    ws.send(JSON.stringify(response));
  }
  private unsubscribeChannel(channel: string, ws: WebSocket, id: string) {
    const socketChannel = this.socketChannelList.filter(
      (e) => e.channel === `live_trades_${channel}`,
    )[0];
    const index = this.socketChannelList.indexOf(socketChannel);
    this.socketChannelList.splice(index, 1);

    const response: WebSocketResponse = {
      event: 'unsubscription_succeeded',
      channel: channel,
      data: {},
    };

    ws.send(JSON.stringify(response));
  }

  private isSocketRequestVaild(socketMessage: SocketMessage): Boolean {
    return (
      _.isString(socketMessage.event) && _.isString(socketMessage.data.channel)
    );
  }
}
