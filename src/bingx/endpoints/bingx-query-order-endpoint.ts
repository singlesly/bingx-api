import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { DefaultSignatureParameters } from 'bingx-api/bingx/account/default-signature-parameters';
import { SignatureParametersInterface } from 'bingx-api/bingx/account/signature-parameters.interface';
import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { QueryOrderInterface } from 'bingx-api/bingx/interfaces/query-order.interface';

export class BingxQueryOrderEndpoint<R = unknown>
  extends Endpoint
  implements EndpointInterface<R>
{
  constructor(
    private readonly order: QueryOrderInterface,
    account: AccountInterface,
  ) {
    super(account);
  }

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'get';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({
      orderId: this.order.orderId,
      symbol: this.order.symbol,
    });
  }

  path(): string {
    return '/openApi/swap/v2/trade/order';
  }

  readonly t!: R;
}
