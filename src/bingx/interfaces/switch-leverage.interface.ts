import { OrderPositionSideEnum } from 'bingx-api/bingx/enums/order-position-side.enum';

export interface SwitchLeverageInterface {
  symbol: string;
  leverage: number;
  side: OrderPositionSideEnum;
}
