import {
  OrderPositionSideEnum,
  OrderSideEnum,
  OrderStatusEnum,
  OrderTypeEnum,
} from 'bingx-api/bingx';

export interface BingxUserHistoryOrdersResponse {
  orders: {
    symbol: string;
    orderId: number;
    side: OrderSideEnum;
    positionSide: OrderPositionSideEnum;
    type: OrderTypeEnum;
    origQty: string;
    price: string;
    executedQty: string;
    avgPrice: string;
    cumQuote: string;
    stopPrice: string;
    profit: string;
    commission: string;
    status: OrderStatusEnum;
    time: number;
    updateTime: number;
    clientOrderId: string;
    leverage: string;
    takeProfit?: {
      type: 'TAKE_PROFIT';
      quantity: number;
      stopPrice: number;
      price: number;
      workingType: string;
    };
    stopLoss?: {
      type: 'STOP';
      quantity: number;
      stopPrice: number;
      price: number;
      workingType: string;
    };
    advanceAttr: number;
    positionID: number;
    takeProfitEntrustPrice: number;
    stopLossEntrustPrice: number;
    orderType: OrderTypeEnum;
    workingType: 'MARK_PRICE';
  }[];
}
