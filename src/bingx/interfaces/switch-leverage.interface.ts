import { OrderPositionSideEnum } from '@app/bingx/enums/order-position-side.enum';

export interface SwitchLeverageInterface {
  symbol: string;
  leverage: number;
  side: OrderPositionSideEnum;
}
