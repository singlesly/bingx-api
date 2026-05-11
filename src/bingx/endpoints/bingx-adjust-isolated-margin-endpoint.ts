import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { DefaultSignatureParameters } from 'bingx-api/bingx/account/default-signature-parameters';
import { SignatureParametersInterface } from 'bingx-api/bingx/account/signature-parameters.interface';
import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { BingxResponse } from 'bingx-api/bingx/interfaces/bingx-response';
import {
  BingxAdjustIsolatedMarginInterface,
  IsolatedMarginAdjustmentType,
} from 'bingx-api/bingx/interfaces/adjust-isolated-margin.interface';

export interface BingxAdjustIsolatedMarginResponseInterface {
  amount: string | number;
  type: IsolatedMarginAdjustmentType;
  positionId?: string | number;
}

export class BingxAdjustIsolatedMarginEndpoint<
    R = BingxAdjustIsolatedMarginResponseInterface,
  >
  extends Endpoint
  implements EndpointInterface<BingxResponse<R>>
{
  constructor(
    private readonly options: BingxAdjustIsolatedMarginInterface,
    account: AccountInterface,
  ) {
    super(account);
  }

  readonly t!: BingxResponse<R>;

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'post';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({
      symbol: this.options.symbol,
      amount: this.options.amount.toString(),
      type: this.options.type.toString(10),
      ...(this.options.positionSide === undefined
        ? {}
        : { positionSide: this.options.positionSide }),
      ...(this.options.positionId === undefined
        ? {}
        : { positionId: this.options.positionId.toString() }),
      ...(this.options.recvWindow === undefined
        ? {}
        : { recvWindow: this.options.recvWindow.toString() }),
    });
  }

  path(): string {
    return '/openApi/swap/v2/trade/positionMargin';
  }
}
