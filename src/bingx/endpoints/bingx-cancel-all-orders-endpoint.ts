import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { SignatureParametersInterface } from 'bingx-api/bingx/account/signature-parameters.interface';
import { DefaultSignatureParameters } from 'bingx-api/bingx/account/default-signature-parameters';
import { AccountInterface } from 'bingx-api/bingx/account/account.interface';

export interface CancelAllOrdersData {
  success: unknown[];
  failed: unknown[];
}

export class BingxCancelAllOrdersEndpoint<R = CancelAllOrdersData>
  extends Endpoint
  implements EndpointInterface<R>
{
  constructor(
    private readonly symbol: string,
    account: AccountInterface,
  ) {
    super(account);
  }

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'delete';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({
      symbol: this.symbol,
    });
  }

  path(): string {
    return '/openApi/swap/v2/trade/allOpenOrders';
  }

  readonly t!: R;
}
