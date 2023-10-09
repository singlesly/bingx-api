import { OrderTypeEnum } from '@app/bingx/enums/order-type.enum';
import { OrderSideEnum } from '@app/bingx/enums/order-side.enum';
import { OrderPositionSideEnum } from '@app/bingx/enums/order-position-side.enum';
import { OrderStatusEnum } from '@app/bingx/enums/order-status.enum';

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
