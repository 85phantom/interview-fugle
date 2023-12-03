import { WebSocket } from 'ws';

export interface SocketChannel {
  socket: WebSocket;
  channel: string;
}

export interface SocketMessage {
  event: string;
  data: {
    channel: string;
  };
}
