import { OrderTypeEnum } from 'bingx-api/bingx/enums/order-type.enum';
import { OrderSideEnum } from 'bingx-api/bingx/enums/order-side.enum';
import { OrderPositionSideEnum } from 'bingx-api/bingx/enums/order-position-side.enum';
import { OrderStatusEnum } from 'bingx-api/bingx/enums/order-status.enum';

export interface BingxOrderInterface {
  time: number;
  symbol: string;
  side: OrderSideEnum;
  type: OrderTypeEnum;
  positionSide: OrderPositionSideEnum;
  cumQuote: string;
  status: OrderStatusEnum;
  stopPrice: string;
  price: string;
  origQty: string;
  avgPrice: string;
  executedQty: string;
  orderId: number;
  profit: string;
  commission: string;
  updateTime: number;
}
