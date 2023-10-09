import { Endpoint } from '@app/bingx/endpoints/endpoint';
import { EndpointInterface } from '@app/bingx/endpoints/endpoint.interface';
import { SignatureParametersInterface } from '@app/bingx/account/signature-parameters.interface';
import { DefaultSignatureParameters } from '@app/bingx/account/default-signature-parameters';
import { AccountInterface } from '@app/bingx/account/account.interface';

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
