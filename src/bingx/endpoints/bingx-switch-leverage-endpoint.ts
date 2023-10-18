import {
  AccountInterface,
  DefaultSignatureParameters,
  Endpoint,
  EndpointInterface,
  OrderPositionSideEnum,
  SignatureParametersInterface,
} from 'bingx-api/bingx';

export interface SwitchLeverageResponse {}

export interface SwitchLeverageInterface {
  symbol: string;
  leverage: number;
  side: OrderPositionSideEnum;
}

export class BingxSwitchLeverageEndpoint
  extends Endpoint
  implements EndpointInterface<SwitchLeverageResponse>
{
  constructor(
    private readonly symbol: string,
    private readonly leverage: number,
    private readonly side: OrderPositionSideEnum,
    readonly account: AccountInterface,
  ) {
    super(account);
  }

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'post';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({
      symbol: this.symbol,
      leverage: this.leverage.toString(10),
      side: this.side,
    });
  }

  path(): string {
    return '/openApi/swap/v2/trade/leverage';
  }

  readonly t!: SwitchLeverageResponse;
}
