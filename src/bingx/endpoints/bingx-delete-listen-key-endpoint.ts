import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { DefaultSignatureParameters } from 'bingx-api/bingx/account/default-signature-parameters';
import { SignatureParametersInterface } from 'bingx-api/bingx/account/signature-parameters.interface';
import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';

export class BingxDeleteListenKeyEndpoint<R = void>
  extends Endpoint
  implements EndpointInterface<R>
{
  constructor(
    private readonly listenKey: string,
    account: AccountInterface,
  ) {
    super(account);
  }

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'delete';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({
      listenKey: this.listenKey,
    });
  }

  path(): string {
    return '/openApi/user/auth/userDataStream';
  }

  readonly t!: R;
}
