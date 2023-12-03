# interview-fugle

## Description

這是有兩個功能的專案，一個是計算能被 id 整除的數字，這個功能同時還包含 rate limit 的限制。另一個是用來獲取 bitstamp 上面 currenccy_pairs 資料，可以透過訂閱指定的頻道即時獲得相關的資料。

## Redis 設定

請準備一台 redis ，host 為 '127.0.0.1'，port 為 6379。或是更改 config/default.js 內的 redis 欄位內容，將 host/port 改為指定的設定。

## Clone 專案

```bash
# 透過 git clone 專案到主機任意路徑下
$ git clone https://github.com/85phantom/interview-fugle

```

## 路徑說明

```bash
$ GET http://localhost:3000/data?user=id
透過 Query Parameter 傳遞參數，id 為 1 到 1000 之間的數字，一分鐘內同樣的 ip 連線不可超過 10 次，同樣的 id 不可超過 5 次。

$ ws://localhost:3000/streaming
使用 WebSocket 訂閱 bitstamp 上指定頻道的 currency pairs
channel_name 包含了 'btcusd', 'btceur', 'btcgbp', 'btcpax', 'gbpusd', 'eurusd', 'xrpusd',  'xrpeur', 'xrpbtc', 'xrpgbp',
```

## WebSocket 參數說明

```bash
# Subscriptions
# 訂閱頻道
{
	"event": "subscribe",
	"data": {
		"channel": "[channel_name]"
	}
}

# Unsubscriptions
# 取消訂閱頻道
{
	"event": "unsubscribe",
	"data": {
		"channel": "[channel_name]"
	}
}

```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# 請先 build 過之後再執行 start
# build
$ npm run build

# start
$ npm run start
```
