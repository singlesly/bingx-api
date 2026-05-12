import {
  AccountInterface,
  DefaultSignatureParameters,
  Endpoint,
  EndpointInterface,
  SignatureParametersInterface,
} from 'bingx-api/bingx';

export interface QueryLeverageResponse {
  code: number;
  msg: string;
  data: {
    longLeverage: number;
    shortLeverage: number;
  };
}

export class BingxQueryLeverageEndpoint
  extends Endpoint
  implements EndpointInterface<QueryLeverageResponse>
{
  constructor(
    private readonly symbol: string,
    account: AccountInterface,
    private readonly recvWindow?: string | number,
  ) {
    super(account);
  }

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'get';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({
      symbol: this.symbol,
      ...(this.recvWindow === undefined
        ? {}
        : { recvWindow: this.recvWindow.toString() }),
    });
  }

  path(): string {
    return '/openApi/swap/v2/trade/leverage';
  }

  readonly t!: QueryLeverageResponse;
}
