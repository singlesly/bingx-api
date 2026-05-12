import {
  AccountInterface,
  BingxResponse,
  DefaultSignatureParameters,
  EndpointInterface,
  SignatureParametersInterface,
} from 'bingx-api/bingx';
import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';
import { BingxUserHistoryOrdersResponse } from 'bingx-api/bingx/endpoints/bingx-user-history-orders-response';

export interface BingxCurrentPendingOrdersOptions {
  symbol?: string;
  type?: string;
  recvWindow?: string | number;
}

export class BingxCurrentPendingOrdersEndpoint<
    R extends BingxUserHistoryOrdersResponse = BingxUserHistoryOrdersResponse,
  >
  extends Endpoint<BingxResponse<R>>
  implements EndpointInterface<BingxResponse<R>>
{
  constructor(
    private readonly options: BingxCurrentPendingOrdersOptions,
    account: AccountInterface,
  ) {
    super(account);
  }

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'get';
  }

  parameters(): SignatureParametersInterface {
    const parameters: Record<string, string> = {};

    if (this.options.symbol !== undefined) {
      parameters.symbol = this.options.symbol;
    }

    if (this.options.type !== undefined) {
      parameters.type = this.options.type;
    }

    if (this.options.recvWindow !== undefined) {
      parameters.recvWindow = this.options.recvWindow.toString();
    }

    return new DefaultSignatureParameters(parameters);
  }

  path(): string {
    return '/openApi/swap/v2/trade/openOrders';
  }

  readonly t!: BingxResponse<R>;
}
