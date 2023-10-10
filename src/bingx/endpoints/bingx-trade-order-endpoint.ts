import { EndpointInterface } from '@app/bingx/endpoints/endpoint.interface';
import { Endpoint } from '@app/bingx/endpoints/endpoint';
import { SignatureParametersInterface } from '../account/signature-parameters.interface';
import { AccountInterface } from '@app/bingx/account/account.interface';
import { BingxCreateTradeOrderInterface } from '@app/bingx/interfaces/trade-order.interface';
import { DefaultSignatureParameters } from '@app/bingx/account/default-signature-parameters';
import { OrderSideEnum } from '@app/bingx/enums/order-side.enum';
import { OrderTypeEnum } from '@app/bingx/enums/order-type.enum';
import { OrderPositionSideEnum } from '@app/bingx/enums/order-position-side.enum';

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
  implements EndpointInterface<R>
{
  constructor(
    private readonly order: BingxCreateTradeOrderInterface,
    account: AccountInterface,
  ) {
    super(account);
  }

  readonly t!: R;

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
