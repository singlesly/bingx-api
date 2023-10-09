import { EndpointInterface } from '@app/bingx/request/endpoint.interface';
import { Endpoint } from '@app/bingx/request/endpoint';
import { SignatureParametersInterface } from '../account/signature-parameters.interface';
import { Throughput } from '@app/bingx/rate-limit/throughput';
import { MarketThroughput } from '@app/bingx/rate-limit/market-throughput';
import { AccountInterface } from '@app/bingx/account/account.interface';
import { BingxCreateTradeOrderInterface } from '@app/bingx/interfaces/trade-order.interface';
import { DefaultSignatureParameters } from '@app/bingx/account/default-signature-parameters';

export class BingxTradeOrderEndpoint
  extends Endpoint
  implements EndpointInterface
{
  constructor(
    private readonly order: BingxCreateTradeOrderInterface,
    account: AccountInterface,
  ) {
    super(account);
  }

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'post';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({
      ...this.order,
    });
  }

  path(): string {
    return '/openApi/swap/v2/trade/order';
  }

  throughput(): Throughput {
    return new MarketThroughput();
  }
}
