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
export type Price = number;
export type Volume = number;

export type TradeDataType = `${TradingPair}@trade`;

export type SubscriptionType = TradeDataType;

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
