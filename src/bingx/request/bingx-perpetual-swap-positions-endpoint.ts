import { Endpoint } from '@app/bingx/request/endpoint';
import { EndpointInterface } from '@app/bingx/request/endpoint.interface';
import { SignatureParametersInterface } from '@app/bingx/account/signature-parameters.interface';
import { AccountInterface } from '@app/bingx/account/account.interface';
import { DefaultSignatureParameters } from '@app/bingx/account/default-signature-parameters';
import { Throughput } from '@app/bingx/rate-limit/throughput';
import { AccountThroughput } from '@app/bingx/rate-limit/account-throughput';

export class BingxPerpetualSwapPositionsEndpoint
  extends Endpoint
  implements EndpointInterface
{
  constructor(private readonly symbol: string, account: AccountInterface) {
    super(account);
  }

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'get';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({
      symbol: this.symbol,
    });
  }

  path(): string {
    return '/openApi/swap/v2/user/positions';
  }

  throughput(): Throughput {
    return new AccountThroughput();
  }
}
