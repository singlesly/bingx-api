import { OrderSideEnum } from 'bingx-api/bingx/enums/order-side.enum';
import { OrderTypeEnum } from 'bingx-api/bingx/enums/order-type.enum';
import { OrderPositionSideEnum } from 'bingx-api/bingx/enums/order-position-side.enum';

/**
 * @deprecated
 */
export interface TradeOrderInterface {
  symbol: string;
  type: OrderTypeEnum;
  side: OrderSideEnum;
  positionSide?: OrderPositionSideEnum;
  clientOrderID?: string;
  price?: string; //float64
  quantity?: string; //float64
  stopPrice?: string; //float64
  timestamp?: string; //int64
  recvWindow?: string; //int64
  timeInForce?: string;
}

export interface BingxTradeOrderInterface {
  symbol: string;
  type: OrderTypeEnum;
  side: OrderSideEnum;
  positionSide?: OrderPositionSideEnum;
  price?: string;
  quantity?: string;
  stopPrice?: string;
  clientOrderId?: string;
  timestamp?: string;
  recvWindow?: string;
  timeInForce?: string;
}

export interface BingxLimitTradeOrderInterface
  extends BingxTradeOrderInterface {
  type: OrderTypeEnum.LIMIT;
  quantity: string;
  price: string;
}

export interface BingxMarketTradeOrderInterface
  extends BingxTradeOrderInterface {
  type: OrderTypeEnum.MARKET;
  quantity: string;
}

export interface BingxTriggerLimitTradeOrderInterface
  extends BingxTradeOrderInterface {
  type: OrderTypeEnum.TRIGGER_LIMIT;
  quantity: string;
  stopPrice: string;
  price: string;
}

export interface BingxTriggeredTradeOrderInterface
  extends BingxTradeOrderInterface {
  type:
    | OrderTypeEnum.STOP_MARKET
    | OrderTypeEnum.TAKE_PROFIT_MARKET
    | OrderTypeEnum.TRIGGER_MARKET;
  stopPrice: string;
  price: string;
}

export type BingxCreateTradeOrderInterface =
  | BingxLimitTradeOrderInterface
  | BingxMarketTradeOrderInterface
  | BingxTriggerLimitTradeOrderInterface
  | BingxTriggeredTradeOrderInterface;
