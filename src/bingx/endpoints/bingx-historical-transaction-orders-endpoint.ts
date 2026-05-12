import {
  AccountInterface,
  BingxResponse,
  DefaultSignatureParameters,
  EndpointInterface,
  SignatureParametersInterface,
} from 'bingx-api/bingx';
import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';

export type TradingUnit = 'COIN' | 'CONT';

export interface BingxHistoricalTransactionOrdersOptions {
  tradingUnit: TradingUnit;
  startTs: Date | number;
  endTs: Date | number;
  symbol?: string;
  currency?: string;
  orderId?: string | number;
  recvWindow?: string | number;
}

export interface BingxHistoricalTransactionOrder {
  filledTm: string;
  symbol: string;
  volume: string;
  price: string;
  amount: string;
  commission: string;
  currency: string;
  orderId: string;
  liquidatedPrice: string;
  liquidatedMarginRatio: string;
  filledTime: string;
  workingType?: string;
  side?: string;
  type?: string;
  positionSide?: string;
  clientOrderID?: string;
  onlyOnePosition?: boolean;
}

export interface BingxHistoricalTransactionOrdersData {
  fill_orders: BingxHistoricalTransactionOrder[];
}

export class BingxHistoricalTransactionOrdersEndpoint<
    R = BingxHistoricalTransactionOrdersData,
  >
  extends Endpoint<BingxResponse<R>>
  implements EndpointInterface<BingxResponse<R>>
{
  constructor(
    private readonly options: BingxHistoricalTransactionOrdersOptions,
    account: AccountInterface,
  ) {
    super(account);
  }

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'get';
  }

  parameters(): SignatureParametersInterface {
    const parameters: Record<string, string> = {
      tradingUnit: this.options.tradingUnit,
      startTs: this.timestampAsString(this.options.startTs),
      endTs: this.timestampAsString(this.options.endTs),
    };

    if (this.options.symbol !== undefined) {
      parameters.symbol = this.options.symbol;
    }

    if (this.options.currency !== undefined) {
      parameters.currency = this.options.currency;
    }

    if (this.options.orderId !== undefined) {
      parameters.orderId = this.options.orderId.toString();
    }

    if (this.options.recvWindow !== undefined) {
      parameters.recvWindow = this.options.recvWindow.toString();
    }

    return new DefaultSignatureParameters(parameters);
  }

  path(): string {
    return '/openApi/swap/v2/trade/allFillOrders';
  }

  private timestampAsString(value: Date | number): string {
    return value instanceof Date
      ? value.getTime().toString(10)
      : value.toString();
  }

  readonly t!: BingxResponse<R>;
}
