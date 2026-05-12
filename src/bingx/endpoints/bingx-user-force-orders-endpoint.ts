import {
  AccountInterface,
  BingxResponse,
  DefaultSignatureParameters,
  EndpointInterface,
  SignatureParametersInterface,
} from 'bingx-api/bingx';
import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';
import { BingxUserHistoryOrdersResponse } from 'bingx-api/bingx/endpoints/bingx-user-history-orders-response';

export type ForceOrderAutoCloseType = 'LIQUIDATION' | 'ADL';

export interface BingxUserForceOrdersOptions {
  symbol?: string;
  currency?: string;
  autoCloseType?: ForceOrderAutoCloseType;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
  recvWindow?: string | number;
}

export class BingxUserForceOrdersEndpoint<
    R extends BingxUserHistoryOrdersResponse = BingxUserHistoryOrdersResponse,
  >
  extends Endpoint<BingxResponse<R>>
  implements EndpointInterface<BingxResponse<R>>
{
  constructor(
    private readonly options: BingxUserForceOrdersOptions,
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

    if (this.options.currency !== undefined) {
      parameters.currency = this.options.currency;
    }

    if (this.options.autoCloseType !== undefined) {
      parameters.autoCloseType = this.options.autoCloseType;
    }

    if (this.options.startTime !== undefined) {
      parameters.startTime = this.timestampAsString(this.options.startTime);
    }

    if (this.options.endTime !== undefined) {
      parameters.endTime = this.timestampAsString(this.options.endTime);
    }

    if (this.options.limit !== undefined) {
      parameters.limit = this.options.limit.toString(10);
    }

    if (this.options.recvWindow !== undefined) {
      parameters.recvWindow = this.options.recvWindow.toString();
    }

    return new DefaultSignatureParameters(parameters);
  }

  path(): string {
    return '/openApi/swap/v2/trade/forceOrders';
  }

  private timestampAsString(value: Date | number): string {
    return value instanceof Date
      ? value.getTime().toString(10)
      : value.toString();
  }

  readonly t!: BingxResponse<R>;
}
