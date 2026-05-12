import {
  AccountInterface,
  BingxResponse,
  DefaultSignatureParameters,
  EndpointInterface,
  SignatureParametersInterface,
} from 'bingx-api/bingx';
import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';

export interface BingxAccountProfitLossFundFlowOptions {
  symbol?: string;
  incomeType?: string;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
  recvWindow?: string | number;
}

export interface BingxAccountProfitLossFundFlowData {
  symbol: string;
  incomeType: string;
  income: string;
  asset: string;
  info: string;
  time: number;
  tranId: string;
  tradeId: string;
}

export class BingxAccountProfitLossFundFlowEndpoint<
    R = BingxAccountProfitLossFundFlowData[],
  >
  extends Endpoint<BingxResponse<R>>
  implements EndpointInterface<BingxResponse<R>>
{
  constructor(
    private readonly options: BingxAccountProfitLossFundFlowOptions,
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

    if (this.options.incomeType !== undefined) {
      parameters.incomeType = this.options.incomeType;
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
    return '/openApi/swap/v2/user/income';
  }

  private timestampAsString(value: Date | number): string {
    return value instanceof Date
      ? value.getTime().toString(10)
      : value.toString();
  }

  readonly t!: BingxResponse<R>;
}
