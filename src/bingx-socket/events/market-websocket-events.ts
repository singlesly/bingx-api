export interface MarkerSubscription {
  id: string;
  reqType: 'sub' | 'unsub';
  dataType: SubscriptionType;
}

export enum MarkerWebsocketEventCode {
  NORMAL = 0,
  ERROR = 1,
}

export type WebSocketNumber = number | string;
export type TransactionTimeInMillis = WebSocketNumber;
export type TradingPair = `${string}-${string}`;
export type IsMarketMaker = boolean;
export type Price = WebSocketNumber;
export type Volume = WebSocketNumber;

export type TradeDataType = `${TradingPair}@trade`;
export type DepthLevel = 5 | 10 | 20 | 50 | 100;
export type DepthInterval = '200ms' | '500ms';
export type KlineInterval =
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1d'
  | '3d'
  | '1w'
  | '1M';
export type MarketDepthDataType =
  `${TradingPair}@depth${DepthLevel}@${DepthInterval}`;
export type KlineDataType = `${TradingPair}@kline_${KlineInterval}`;

export type SubscriptionType =
  | TradeDataType
  | MarketDepthDataType
  | KlineDataType;

export interface MarketWebsocketEvents {
  code: MarkerWebsocketEventCode | string;
  dataType: SubscriptionType;
}

export interface TradeDetail {
  T: TransactionTimeInMillis;
  s: TradingPair;
  m: IsMarketMaker;
  p: Price;
  v: Volume; // Assuming 'q' represents volume
}

export interface LatestTradeEvent extends MarketWebsocketEvents {
  dataType: TradeDataType;
  data: TradeDetail[];
}

export type DepthPriceLevel = [Price, Volume];

export interface MarketDepthDetail {
  bids: DepthPriceLevel[];
  asks: DepthPriceLevel[];
  T: TransactionTimeInMillis;
}

export interface MarketDepthEvent extends MarketWebsocketEvents {
  dataType: MarketDepthDataType;
  data: MarketDepthDetail;
}

export interface KlineDetail {
  t: TransactionTimeInMillis;
  T: TransactionTimeInMillis;
  o: Price;
  h: Price;
  l: Price;
  c: Price;
  v: Volume;
}

export interface KlineEvent extends MarketWebsocketEvents {
  dataType: KlineDataType;
  data: {
    s: TradingPair;
    K: KlineDetail;
  };
}
