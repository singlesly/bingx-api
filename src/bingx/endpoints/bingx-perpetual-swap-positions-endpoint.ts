import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { SignatureParametersInterface } from 'bingx-api/bingx/account/signature-parameters.interface';
import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { DefaultSignatureParameters } from 'bingx-api/bingx/account/default-signature-parameters';
import { OrderPositionSideEnum } from 'bingx-api/bingx/enums/order-position-side.enum';

export interface PerpetualSwapPositionsData<
  T extends number | string = string,
> {
  symbol: string;
  positionId: string;
  positionSide: OrderPositionSideEnum;
  isolated: boolean;
  positionAmt: T;
  availableAmt: string;
  unrealizedProfit: T;
  realisedProfit: T;
  initialMargin: T;
  avgPrice: T;
  leverage: number;
}

export class BingxPerpetualSwapPositionsEndpoint<R = PerpetualSwapPositionsData>
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
    return 'get';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({
      symbol: this.symbol,
    });
  }

  path(): string {
    return '/openApi/swap/v2/user/positions';
  }

  readonly t!: R;
}
