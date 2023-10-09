import { EndpointInterface } from '@app/bingx/endpoints/endpoint.interface';
import { Endpoint } from '@app/bingx/endpoints/endpoint';
import { SignatureParametersInterface } from '@app/bingx/account/signature-parameters.interface';
import { DefaultSignatureParameters } from '@app/bingx/account/default-signature-parameters';

export interface BingxGetServerTimeResponseData {
  serverTime: number;
}

export class BingxGetServerTimeEndpoint<R = BingxGetServerTimeResponseData>
  extends Endpoint
  implements EndpointInterface<R>
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

  readonly t!: R;
}
