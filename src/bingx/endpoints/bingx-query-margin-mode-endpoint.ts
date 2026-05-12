import {
  AccountInterface,
  DefaultSignatureParameters,
  Endpoint,
  EndpointInterface,
  SignatureParametersInterface,
} from 'bingx-api/bingx';
import { MarginType } from 'bingx-api/bingx/endpoints/bingx-switch-margin-mode-endpoint';

export interface QueryMarginModeResponse {
  code: number;
  msg: string;
  data: {
    symbol: string;
    marginType: MarginType;
  };
}

export class BingxQueryMarginModeEndpoint
  extends Endpoint
  implements EndpointInterface<QueryMarginModeResponse>
{
  public constructor(
    private readonly symbol: string,
    account: AccountInterface,
  ) {
    super(account);
  }

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'get';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({
      symbol: this.symbol,
    });
  }

  path(): string {
    return '/openApi/swap/v2/trade/marginType';
  }

  readonly t!: QueryMarginModeResponse;
}
