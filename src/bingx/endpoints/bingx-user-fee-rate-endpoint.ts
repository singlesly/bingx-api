import {
  AccountInterface,
  BingxResponse,
  DefaultSignatureParameters,
  EndpointInterface,
  SignatureParametersInterface,
} from 'bingx-api/bingx';
import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';

export interface BingxUserFeeRateData {
  [key: string]: unknown;
}

export class BingxUserFeeRateEndpoint<R = BingxUserFeeRateData>
  extends Endpoint
  implements EndpointInterface<BingxResponse<R>>
{
  constructor(
    account: AccountInterface,
    private readonly symbol?: string,
  ) {
    super(account);
  }

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'get';
  }

  parameters(): SignatureParametersInterface {
    if (this.symbol) {
      return new DefaultSignatureParameters({ symbol: this.symbol });
    }
    return new DefaultSignatureParameters();
  }

  path(): string {
    return '/openApi/swap/v2/user/commissionRate';
  }

  readonly t!: BingxResponse<R>;
}
