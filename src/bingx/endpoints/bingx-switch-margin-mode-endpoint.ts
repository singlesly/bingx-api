import {
  AccountInterface,
  DefaultSignatureParameters,
  Endpoint,
  EndpointInterface,
  SignatureParametersInterface,
} from 'bingx-api/bingx';

export interface SwitchMarginModeResponse {
  code: number;
  msg: string;
}

export type MarginType = 'ISOLATED' | 'CROSSED';

export class BingxSwitchMarginModeEndpoint
  extends Endpoint
  implements EndpointInterface<SwitchMarginModeResponse>
{
  public constructor(
    private readonly symbol: string,
    private readonly marginType: MarginType,
    account: AccountInterface,
  ) {
    super(account);
  }

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'post';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({
      symbol: this.symbol,
      marginType: this.marginType,
    });
  }

  path(): string {
    return '/openApi/swap/v2/trade/marginType';
  }

  readonly t!: SwitchMarginModeResponse;
}
