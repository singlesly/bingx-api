import { BingxRequestInterface } from '@app/bingx/request/bingx-request.interface';
import { OrderSideEnum } from '@app/bingx/enums/order-side.enum';
import { OrderTypeEnum } from '@app/bingx/enums/order-type.enum';
import { OrderPositionSideEnum } from '@app/bingx/enums/order-position-side.enum';
import { BingxResponseInterface } from '@app/bingx/request/bingx-response.interface';
import { AccountInterface } from '@app/bingx/account/account.interface';
import { BingxTradeOrderEndpoint } from '@app/bingx/request/bingx-trade-order-endpoint';
import { BingxRequest } from '@app/bingx/request/bingx-request';
import { BingxCreateTradeOrderInterface } from '@app/bingx/interfaces/trade-order.interface';

export interface BingxOrderInterface {
  order: {
    symbol: string;
    side: OrderSideEnum;
    type: OrderTypeEnum;
    positionSide: OrderPositionSideEnum;
    orderId: number;
    clientOrderId: string;
  };
}

export class BingxTradeOrderRequest
  implements BingxRequestInterface<BingxResponseInterface<BingxOrderInterface>>
{
  private readonly request = new BingxRequest<
    BingxResponseInterface<BingxOrderInterface>
  >(new BingxTradeOrderEndpoint(this.order, this.account));

  constructor(
    private readonly order: BingxCreateTradeOrderInterface,
    private readonly account: AccountInterface,
  ) {}

  getResponse(): Promise<BingxResponseInterface<BingxOrderInterface>> {
    return this.request.getResponse();
  }
}
