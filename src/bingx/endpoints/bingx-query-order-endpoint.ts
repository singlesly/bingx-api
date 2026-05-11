import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { DefaultSignatureParameters } from 'bingx-api/bingx/account/default-signature-parameters';
import { SignatureParametersInterface } from 'bingx-api/bingx/account/signature-parameters.interface';
import { BingxResponse } from 'bingx-api/bingx/interfaces/bingx-response';
import { BingxOrderInterface } from 'bingx-api/bingx/interfaces/bingx-order.interface';
import { QueryOrderInterface } from 'bingx-api/bingx/interfaces/query-order.interface';
import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';

export interface BingxQueryOrderResponseInterface {
  order: BingxOrderInterface & {
    clientOrderId?: string;
    workingType?: string;
    closePosition?: string;
    stopGuaranteed?: boolean;
    triggerOrderId?: number;
  };
}

export class BingxQueryOrderEndpoint<R = BingxQueryOrderResponseInterface>
  extends Endpoint
  implements EndpointInterface<BingxResponse<R>>
{
  constructor(
    private readonly order: QueryOrderInterface,
    account: AccountInterface,
  ) {
    super(account);
  }

  readonly t!: BingxResponse<R>;

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'get';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({
      symbol: this.order.symbol,
      ...(this.order.orderId === undefined
        ? {}
        : { orderId: this.order.orderId }),
      ...(this.order.clientOrderId === undefined
        ? {}
        : { clientOrderId: this.order.clientOrderId }),
      ...(this.order.recvWindow === undefined
        ? {}
        : { recvWindow: this.order.recvWindow }),
    });
  }

  path(): string {
    return '/openApi/swap/v2/trade/order';
  }
}
