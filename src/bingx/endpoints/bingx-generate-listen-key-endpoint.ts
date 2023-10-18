import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';
import { SignatureParametersInterface } from 'bingx-api/bingx/account/signature-parameters.interface';
import { DefaultSignatureParameters } from 'bingx-api/bingx/account/default-signature-parameters';
import { BingxGenerateListenKeyResponse } from 'bingx-api/bingx/endpoints/bingx-generate-listen-key-response';

export class BingxGenerateListenKeyEndpoint<
    R extends BingxGenerateListenKeyResponse,
  >
  extends Endpoint
  implements EndpointInterface<R>
{
  readonly t!: R;
  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'post';
  }

  path(): string {
    return '/openApi/user/auth/userDataStream';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters();
  }
}
