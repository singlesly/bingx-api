import { Endpoint } from '@app/bingx/request/endpoint';
import { EndpointInterface } from '@app/bingx/request/endpoint.interface';
import { SignatureParametersInterface } from '@app/bingx/account/signature-parameters.interface';
import { Throughput } from '@app/bingx/rate-limit/throughput';
import { DefaultSignatureParameters } from '@app/bingx/account/default-signature-parameters';
import { MarketThroughput } from '@app/bingx/rate-limit/market-throughput';
import { AccountInterface } from '@app/bingx/account/account.interface';

export class BingxCancelAllOrdersEndpoint
  extends Endpoint
  implements EndpointInterface
{
  constructor(private readonly symbol: string, account: AccountInterface) {
    super(account);
  }

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'delete';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({
      symbol: this.symbol,
    });
  }

  path(): string {
    return '/openApi/swap/v2/trade/allOpenOrders';
  }

  throughput(): Throughput {
    return new MarketThroughput();
  }
}
