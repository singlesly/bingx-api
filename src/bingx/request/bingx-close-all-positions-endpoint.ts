import { Endpoint } from '@app/bingx/request/endpoint';
import { EndpointInterface } from '@app/bingx/request/endpoint.interface';
import { SignatureParametersInterface } from '@app/bingx/account/signature-parameters.interface';
import { Throughput } from '@app/bingx/rate-limit/throughput';
import { DefaultSignatureParameters } from '@app/bingx/account/default-signature-parameters';
import { MarketThroughput } from '@app/bingx/rate-limit/market-throughput';

export class BingxCloseAllPositionsEndpoint
  extends Endpoint
  implements EndpointInterface
{
  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'post';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({});
  }

  path(): string {
    return '/openApi/swap/v2/trade/closeAllPositions';
  }

  throughput(): Throughput {
    return new MarketThroughput();
  }
}
