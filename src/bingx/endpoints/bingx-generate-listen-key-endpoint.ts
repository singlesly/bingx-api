import { EndpointInterface } from '@app/bingx/endpoints/endpoint.interface';
import { Endpoint } from '@app/bingx/endpoints/endpoint';
import { SignatureParametersInterface } from '@app/bingx/account/signature-parameters.interface';
import { DefaultSignatureParameters } from '@app/bingx/account/default-signature-parameters';
import { BingxGenerateListenKeyResponse } from '@app/bingx/endpoints/bingx-generate-listen-key-response';

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
