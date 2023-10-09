import { OrderTypeEnum } from '@app/bingx/enums/order-type.enum';
import { OrderSideEnum } from '@app/bingx/enums/order-side.enum';
import { OrderStatusEnum } from '@app/bingx/enums/order-status.enum';
import { OrderPositionSideEnum } from '@app/bingx/enums/order-position-side.enum';

export type EventType = 'ORDER_TRADE_UPDATE' | 'listenKeyExpired';

export type SpecificExecutionType =
  | 'NEW'
  | 'CANCELED'
  | 'CALCULATED'
  | 'EXPIRED'
  | 'TRADE';

export type WebSocketOrder = {
  s: string;
  c: string;
  i: number;
  S: OrderSideEnum;
  o: 'MARKET' | 'STOP' | 'LIMIT' | 'TAKE_PROFIT' | 'LIQUIDATION';
  q: string;
  p: string;
  ap: string;
  x: SpecificExecutionType;
  X: OrderStatusEnum;
  N: string;
  n: string;
  T: number;
  wt: 'MARK_PRICE' | 'CONTRACT_PRICE' | 'INDEX_PRICE';
  ps: OrderPositionSideEnum;
  rp: string;
  z: string;
};

export type WebsocketEvent = {
  e: EventType;
  E: number;
  o: WebSocketOrder;
};
