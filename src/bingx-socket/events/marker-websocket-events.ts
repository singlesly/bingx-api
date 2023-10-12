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

export interface MarkerWebsocketEvents {
  code: MarkerWebsocketEventCode;
  dataType: SubscriptionType;
}

export interface LatestTradeEvent extends MarkerWebsocketEvents {
  dataType: TradeDataType;
  T: TransactionTimeInMillis;
  s: TradingPair;
  m: IsMarketMaker;
  p: Price;
  v: Volume;
}
