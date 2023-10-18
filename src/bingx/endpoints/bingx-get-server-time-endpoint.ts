import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';
import { SignatureParametersInterface } from 'bingx-api/bingx/account/signature-parameters.interface';
import { DefaultSignatureParameters } from 'bingx-api/bingx/account/default-signature-parameters';

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
