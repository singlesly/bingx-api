import {
  AccountInterface,
  BingxResponse,
  DefaultSignatureParameters,
  EndpointInterface,
  SignatureParametersInterface,
} from 'bingx-api/bingx';
import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';

export interface BingxUserFeeRateData {
  commission: {
    takerCommissionRate: number | string;
    makerCommissionRate: number | string;
  };
}

export class BingxUserFeeRateEndpoint<R = BingxUserFeeRateData>
  extends Endpoint<BingxResponse<R>>
  implements EndpointInterface<BingxResponse<R>>
{
  constructor(
    account: AccountInterface,
    private readonly recvWindow?: number,
  ) {
    super(account);
  }

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'get';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters(
      this.recvWindow === undefined
        ? {}
        : {
            recvWindow: this.recvWindow.toString(10),
          },
    );
  }

  path(): string {
    return '/openApi/swap/v2/user/commissionRate';
  }

  readonly t!: BingxResponse<R>;
}
