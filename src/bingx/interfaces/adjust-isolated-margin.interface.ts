import { OrderPositionSideEnum } from 'bingx-api/bingx/enums/order-position-side.enum';

export type IsolatedMarginAdjustmentType = 1 | 2;

export interface BingxAdjustIsolatedMarginInterface {
  symbol: string;
  amount: string | number;
  type: IsolatedMarginAdjustmentType;
  positionSide?: OrderPositionSideEnum;
  positionId?: string | number;
  recvWindow?: string | number;
}
