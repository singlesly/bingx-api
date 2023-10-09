import { EndpointInterface } from '@app/bingx/request/endpoint.interface';
import { Endpoint } from '@app/bingx/request/endpoint';
import { SignatureParametersInterface } from '@app/bingx/account/signature-parameters.interface';
import { Throughput } from '@app/bingx/rate-limit/throughput';
import { DefaultSignatureParameters } from '@app/bingx/account/default-signature-parameters';
import { AccountThroughput } from '@app/bingx/rate-limit/account-throughput';

export class BingxGetServerTimeEndpoint
  extends Endpoint
  implements EndpointInterface
{
  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'get';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({});
  }

  path(): string {
    return '/openApi/swap/v2/server/time';
  }

  throughput(): Throughput {
    return new AccountThroughput();
  }
}
