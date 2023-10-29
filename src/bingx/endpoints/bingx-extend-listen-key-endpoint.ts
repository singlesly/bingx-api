import {
  AccountInterface,
  DefaultSignatureParameters,
  Endpoint,
  EndpointInterface,
  SignatureParametersInterface,
} from 'bingx-api/bingx';

export class BingxExtendListenKeyEndpoint<R = void>
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
    return 'put';
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
