export interface MarkerSubscription {
  id: string;
  reqType: 'sub' | 'unsub';
  dataType: SubscriptionType;
}

export enum MarkerWebsocketEventCode {
  NORMAL = 0,
  ERROR = 1,
}

export type TransactionTimeInMillis = number;
export type TradingPair = `${string}-${string}`;
export type IsMarketMaker = boolean;
export type Price = string | number;
export type Volume = string | number;

export type TradeDataType = `${TradingPair}@trade`;
export type MarketDepthLevel = 5 | 10 | 20 | 50 | 100;
export type MarketDepthDataType = `${TradingPair}@depth${MarketDepthLevel}`;
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
export type KlineDataType = `${TradingPair}@kline_${KlineInterval}`;

export type SubscriptionType =
  | TradeDataType
  | MarketDepthDataType
  | KlineDataType;

export interface MarketWebsocketEvents {
  code: MarkerWebsocketEventCode;
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
  code: MarkerWebsocketEventCode;
  dataType: TradeDataType;
  data: TradeDetail[];
}

export interface MarketDepthEntry {
  p: Price;
  v: Volume;
}

export interface MarketDepthData {
  asks: MarketDepthEntry[];
  bids: MarketDepthEntry[];
}

export interface MarketDepthEvent extends MarketWebsocketEvents {
  code: MarkerWebsocketEventCode;
  dataType: MarketDepthDataType;
  data: MarketDepthData;
}

export interface KlineData {
  c: Price;
  h: Price;
  l: Price;
  o: Price;
  v: Volume;
  s: TradingPair;
}

export interface KlineEvent extends MarketWebsocketEvents {
  code: MarkerWebsocketEventCode;
  dataType: KlineDataType;
  data: KlineData;
}
