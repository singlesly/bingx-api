import { AccountInterface } from '../account/account.interface';
import { DefaultSignatureParameters } from '../account/default-signature-parameters';
import { SignatureParametersInterface } from '../account/signature-parameters.interface';
import { Endpoint } from './endpoint';
import { EndpointInterface } from './endpoint.interface';

export class BingxCancelOrderEndpoint<R = unknown>
  extends Endpoint
  implements EndpointInterface<R>
{
  constructor(
    account: AccountInterface,
    private readonly orderId: string,
  ) {
    super(account);
  }

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'delete';
  }
  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({
      orderId: this.orderId,
    });
  }
  path(): string {
    return '/openApi/swap/v2/trade/order';
  }
  readonly t!: R;
}
