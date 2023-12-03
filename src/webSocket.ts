import { WebSocket, WebSocketServer } from 'ws';
import {
  BitstampData,
  BitstampResponse,
  OHLC,
  OhlcChannel,
  SocketChannel,
  WebSocketResponse,
} from './schema/websocket';
import moment from 'moment';
import { WebSocketServerService } from './webSocketServer';

export class WebSocketService {
  public wsss: WebSocketServerService;
  public bitstampSocket: WebSocket;
  public bitstampChannelList: string[];
  public socketChannelList: SocketChannel[];
  public bitstampDataList: BitstampData[];
  public channelOhlcList: OhlcChannel[];

  constructor(wsss: WebSocketServerService) {
    this.wsss = wsss;
    this.bitstampSocket = new WebSocket('wss://ws.bitstamp.net.');
    this.bitstampChannelList = ['btcusd', 'btceur', 'btcgbp'];
    this.socketChannelList = [];
    this.bitstampDataList = [];
    this.channelOhlcList = [];
  }

  public initBitstampSockets() {
    this.bitstampSocket.onopen = () => {
      console.log('open connection to bitstamp');
      this.bitstampChannelList.forEach((channelName) => {
        this.SubscribeBitstampChannel(channelName);
      });
    };

    this.bitstampSocket.onmessage = (e) => {
      const bitstampResponse = JSON.parse(
        e.data.toString(),
      ) as BitstampResponse;
      const { data, channel, event } = bitstampResponse;

      if (event === 'trade') {
        const bitstampData = new BitstampData(bitstampResponse);
        const tradeDate = new Date(data.timestamp * 1000);
        this.bitstampDataList.push(bitstampData);

        const ohlc = this.getTagetTimeOhlc(channel, tradeDate);
        const ohlcResponse = this.upsertChannelOhlcList(
          channel,
          tradeDate,
          ohlc,
        );
        const socketChannelList = this.wsss.getSocketChannelList();
        const wsList = socketChannelList.filter((d) => d.channel === channel);

        const response: WebSocketResponse = {
          data: bitstampData,
          channel,
          event,
        };
        wsList.forEach((ws) => {
          ws.socket.send(JSON.stringify(response));
          ws.socket.send(JSON.stringify({ ...ohlcResponse, event: 'OHLC' }));
        });
      }

      if (event === 'bts:error')
        console.error('bitstampResponse:', bitstampResponse);
    };
  }

  private SubscribeBitstampChannel(channel) {
    this.bitstampSocket.send(
      JSON.stringify({
        event: 'bts:subscribe',
        data: {
          channel: `live_trades_${channel}`,
        },
      }),
    );
  }

  private calculateOHLC(dataList: BitstampData[]): OHLC {
    const prices = dataList.map((d) => d.price);
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);

    return { firstPrice, lastPrice, maxPrice, minPrice };
  }

  private getTagetTimeOhlc(channel: string, targetTime: Date): OHLC {
    const oneMinuteChannelData = this.bitstampDataList.filter(
      (d) =>
        d.channel === channel && this.isTimeInTargetMinute(d.date, targetTime),
    );
    const ohlc = this.calculateOHLC(oneMinuteChannelData);
    return ohlc;
  }
  private isTimeInTargetMinute(time: Date, targetMintue: Date): Boolean {
    const start = moment(targetMintue).startOf('minute');
    const end = moment(targetMintue).endOf('minute');
    return moment(time).isBetween(start, end);
  }

  private upsertChannelOhlcList(
    channel: string,
    time: Date,
    ohlc: OHLC,
  ): OhlcChannel {
    const minute = moment(time).startOf('minute').toDate();
    let targetOhlc = this.channelOhlcList.filter(
      (e) => e.channel === channel && e.minute === minute,
    )[0];
    if (targetOhlc) {
      targetOhlc.ohlc = ohlc;
    } else {
      targetOhlc = { channel, minute, ohlc };
      this.channelOhlcList.push(targetOhlc);
    }
    return targetOhlc;
  }
}
