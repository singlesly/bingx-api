import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { DefaultSignatureParameters } from 'bingx-api/bingx/account/default-signature-parameters';
import { SignatureParametersInterface } from 'bingx-api/bingx/account/signature-parameters.interface';
import { BingxResponse } from 'bingx-api/bingx/interfaces/bingx-response';
import { BingxCreateTradeOrderInterface } from 'bingx-api/bingx/interfaces/trade-order.interface';
import { OrderPositionSideEnum } from 'bingx-api/bingx/enums/order-position-side.enum';
import { OrderSideEnum } from 'bingx-api/bingx/enums/order-side.enum';
import { OrderTypeEnum } from 'bingx-api/bingx/enums/order-type.enum';
import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';

export interface BingxBulkOrderResponseInterface {
  orders: Array<{
    symbol: string;
    side: OrderSideEnum;
    type: OrderTypeEnum;
    positionSide: OrderPositionSideEnum;
    orderId: number;
    clientOrderId: string;
    workingType: string;
  }>;
}

export class BingxBulkOrderEndpoint<R = BingxBulkOrderResponseInterface>
  extends Endpoint
  implements EndpointInterface<BingxResponse<R>>
{
  constructor(
    private readonly orders: BingxCreateTradeOrderInterface[],
    account: AccountInterface,
    private readonly recvWindow?: number,
  ) {
    super(account);
  }

  readonly t!: BingxResponse<R>;

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'post';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({
      batchOrders: JSON.stringify(this.orders),
      ...(this.recvWindow === undefined
        ? {}
        : { recvWindow: this.recvWindow.toString(10) }),
    });
  }

  path(): string {
    return '/openApi/swap/v2/trade/batchOrders';
  }
}
