import { OhlcChannel } from './schema/websocket';

export class OhlcChannelDataset {
  public list: OhlcChannel[];
  constructor() {
    this.list = [];
  }

  public getOhlcChannel() {
    return this.list;
  }

  public setOhlcChannel(list: OhlcChannel[]) {
    this.list = list;
  }

  public push(ohlcChannel: OhlcChannel) {
    this.list.push(ohlcChannel);
  }
}
