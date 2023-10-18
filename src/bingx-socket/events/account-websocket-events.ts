import { OrderPositionSideEnum, OrderSideEnum } from 'bingx-api/bingx';

export enum AccountWebsocketEventType {
  LISTEN_KEY_EXPIRED = 'listenKeyExpired',
  ACCOUNT_UPDATE = 'ACCOUNT_UPDATE',
  ORDER_TRADE_UPDATE = 'ORDER_TRADE_UPDATE',
  ACCOUNT_CONFIG_UPDATE = 'ACCOUNT_CONFIG_UPDATE',
}

export enum AccountUpdateEventLaunchReason {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  ORDER = 'ORDER',
  FUNDING_FEE = 'FUNDING_FEE',
}

export enum WebSocketOrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  STOP = 'STOP',
  TAKE_PROFIT = 'TAKE_PROFIT',
  LIQUIDATION = 'LIQUIDATION',
}

export enum WebSocketOrderExecutionType {
  NEW = 'NEW',
  CANCELED = 'CANCELED',
  CALCULATED = 'CALCULATED',
  EXPIRED = 'EXPIRED',
  TRADE = 'TRADE',
}

export enum WebSocketOrderStatus {
  NEW = 'NEW',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  FILLED = 'FILLED',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
}

export enum WebSocketTriggerPriceType {
  MARK_PRICE = 'MARK_PRICE',
  CONTRACT_PRICE = 'CONTRACT_PRICE',
  INDEX_PRICE = 'INDEX_PRICE',
}

export type EventTimeInMilliseconds = number;

/**
 * Relates account events
 */
export type AssetName = string;
export type WalletBalance = number;
export type WalletBalanceExcludingIsolatedMargin = number;
export type WalletBalanceChangeAmount = number;
export type TradingPair = `${string}-${string}`;
export type Position = number;
export type EntryPrice = number;
export type UnrealizedProfitAndLossPosition = number;
export type MarginMode = string;
export type IsolatedPositionMargin = number;

/**
 * Relates to order update events
 */
export type ClientCustomOrderId = string;
export type OrderId = string;
export type Quantity = number;
export type Price = number;
export type AveragePrice = number;
export type HandlingFee = number;
export type TransactionTime = number;
export type TransactionAchievedProfitAndLoss = number;
export type OrderFilledAccumulatedQuantity = number;
export type FeeAssetType = string;

export interface AccountBalanceInformation {
  a: AssetName;
  wb: WalletBalance;
  cw: WalletBalanceExcludingIsolatedMargin;
  bc: WalletBalanceChangeAmount;
}

export interface TradeInfo {
  s: TradingPair;
  pa: Position;
  ep: EntryPrice;
  up: UnrealizedProfitAndLossPosition;
  mt: MarginMode;
  iw: IsolatedPositionMargin;
  ps: OrderPositionSideEnum;
}

export interface AccountWebSocketOrder {
  s: TradingPair;
  c: ClientCustomOrderId;
  i: OrderId;
  S: OrderSideEnum;
  o: WebSocketOrderType;
  q: Quantity;
  p: Price;
  ap: AveragePrice;
  x: WebSocketOrderExecutionType;
  X: WebSocketOrderStatus;
  N: FeeAssetType;
  n: HandlingFee;
  T: TransactionTime;
  wt: WebSocketTriggerPriceType;
  ps: OrderPositionSideEnum;
  rp: TransactionAchievedProfitAndLoss;
  z: OrderFilledAccumulatedQuantity;
}

export interface AccountUpdateEvent {
  m: AccountUpdateEventLaunchReason;
  B: AccountBalanceInformation[];
  P: TradeInfo[];
}

export interface AccountWebSocketEvent {
  e: AccountWebsocketEventType;
  E: EventTimeInMilliseconds;
}

export interface ListenKeyExpiredEvent extends AccountWebSocketEvent {
  e: AccountWebsocketEventType.LISTEN_KEY_EXPIRED;
  listenKey: string;
}

export interface AccountBalanceAndPositionPushEvent
  extends AccountWebSocketEvent {
  e: AccountWebsocketEventType.ACCOUNT_UPDATE;
  T: EventTimeInMilliseconds;
  a: AccountUpdateEvent;
}

export interface AccountOrderUpdatePushEvent extends AccountWebSocketEvent {
  e: AccountWebsocketEventType.ORDER_TRADE_UPDATE;
  E: EventTimeInMilliseconds;
  o: AccountWebSocketOrder;
}
