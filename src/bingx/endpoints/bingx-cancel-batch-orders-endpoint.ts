import {
  AccountInterface,
  BingxResponse,
  DefaultSignatureParameters,
  EndpointInterface,
  SignatureParametersInterface,
} from 'bingx-api/bingx';
import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';
import { BingxUserHistoryOrdersResponse } from 'bingx-api/bingx/endpoints/bingx-user-history-orders-response';

export interface BingxCancelBatchOrdersOptions {
  symbol: string;
  orderIdList?: Array<string | number>;
  clientOrderIdList?: string[];
  recvWindow?: string | number;
}

export interface BingxCancelBatchOrdersFailedOrder {
  orderId?: string | number;
  clientOrderId?: string;
  errorCode: number;
  errorMessage: string;
}

export interface BingxCancelBatchOrdersData {
  success: BingxUserHistoryOrdersResponse['orders'];
  failed: BingxCancelBatchOrdersFailedOrder[] | null;
}

export class BingxCancelBatchOrdersEndpoint<R = BingxCancelBatchOrdersData>
  extends Endpoint<BingxResponse<R>>
  implements EndpointInterface<BingxResponse<R>>
{
  constructor(
    private readonly options: BingxCancelBatchOrdersOptions,
    account: AccountInterface,
  ) {
    super(account);
  }

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'delete';
  }

  parameters(): SignatureParametersInterface {
    const parameters: Record<string, string> = {
      symbol: this.options.symbol,
    };

    if (this.options.orderIdList !== undefined) {
      parameters.orderIdList = this.serializeOrderIds(this.options.orderIdList);
    }

    if (this.options.clientOrderIdList !== undefined) {
      parameters.clientOrderIdList = JSON.stringify(
        this.options.clientOrderIdList,
      );
    }

    if (this.options.recvWindow !== undefined) {
      parameters.recvWindow = this.options.recvWindow.toString();
    }

    return new DefaultSignatureParameters(parameters);
  }

  path(): string {
    return '/openApi/swap/v2/trade/batchOrders';
  }

  private serializeOrderIds(orderIds: Array<string | number>): string {
    return `[${orderIds.map((orderId) => orderId.toString()).join(',')}]`;
  }

  readonly t!: BingxResponse<R>;
}
