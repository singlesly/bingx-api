import {
  AccountInterface,
  BingxResponse,
  DefaultSignatureParameters,
  Endpoint,
  EndpointInterface,
  SignatureParametersInterface,
} from 'bingx-api/bingx';
import { BingxUserHistoryOrdersResponse } from 'bingx-api/bingx/endpoints/bingx-user-history-orders-response';

export class BingxUserHistoryOrdersEndpoint<
    R extends BingxUserHistoryOrdersResponse,
  >
  extends Endpoint<BingxResponse<R>>
  implements EndpointInterface<BingxResponse<R>>
{
  constructor(
    private readonly symbol: string,
    private readonly limit: number,
    private readonly startTime: Date,
    private readonly endTime: Date,
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
      limit: this.limit.toString(10),
      startTime: this.startTime.getTime().toString(10),
      endTime: this.endTime.getTime().toString(10),
    });
  }
  path(): string {
    return '/openApi/swap/v2/trade/allOrders';
  }

  readonly t!: BingxResponse<R>;
}
