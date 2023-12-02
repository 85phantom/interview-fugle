export class SocketChannel {
  public socket: WebSocket;
  public channel: string;
  constructor(data: any) {
    this.socket = data.socket;
    this.channel = data.channel;
  }
}

export interface BitstampResponse {
  data: BitstampResponseData;
  channel: string;
  event: string;
}

export interface BitstampResponseData {
  id: number;
  price: number;
  timestamp: number;
}

export class BitstampData {
  public id: number;
  public price: number;
  public channel: string;
  public event: string;
  public date: Date;
  constructor(data: BitstampResponse) {
    this.id = data.data.id;
    this.price = data.data.price;
    this.channel = data.channel;
    this.event = data.event;
    this.date = new Date(data.data.timestamp * 1000);
  }
}

export class DataChannel {
  public data: WebSocket;
  public channel: string;
  constructor(data: any) {
    this.data = data.socket;
    this.channel = data.channel;
  }
}

export interface OHLC {
  firstPrice: number;
  lastPrice: number;
  maxPrice: number;
  minPrice: number;
}

export interface OhlcChannel {
  channel: string;
  minute: Date;
  ohlc: OHLC;
}
