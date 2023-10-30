import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';
import { BingxResponse, SignatureParametersInterface } from 'bingx-api/bingx';
import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { BingxCreateTradeOrderInterface } from 'bingx-api/bingx/interfaces/trade-order.interface';
import { DefaultSignatureParameters } from 'bingx-api/bingx/account/default-signature-parameters';
import { OrderSideEnum } from 'bingx-api/bingx/enums/order-side.enum';
import { OrderTypeEnum } from 'bingx-api/bingx/enums/order-type.enum';
import { OrderPositionSideEnum } from 'bingx-api/bingx/enums/order-position-side.enum';

export interface BingxOrderResponseInterface {
  order: {
    symbol: string;
    side: OrderSideEnum;
    type: OrderTypeEnum;
    positionSide: OrderPositionSideEnum;
    orderId: number;
    clientOrderId: string;
  };
}

export class BingxTradeOrderEndpoint<R = BingxOrderResponseInterface>
  extends Endpoint
  implements EndpointInterface<BingxResponse<R>>
{
  constructor(
    private readonly order: BingxCreateTradeOrderInterface,
    account: AccountInterface,
  ) {
    super(account);
  }

  readonly t!: BingxResponse<R>;

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'post';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({
      ...this.order,
    });
  }

  path(): string {
    return '/openApi/swap/v2/trade/order';
  }
}
