import { Endpoint } from '@app/bingx/endpoints/endpoint';
import { EndpointInterface } from '@app/bingx/endpoints/endpoint.interface';
import { SignatureParametersInterface } from '@app/bingx/account/signature-parameters.interface';
import { DefaultSignatureParameters } from '@app/bingx/account/default-signature-parameters';

export interface BingxCloseAllPositionsData {
  success: number[];
  failed: number[];
}

export class BingxCloseAllPositionsEndpoint<R = BingxCloseAllPositionsData>
  extends Endpoint
  implements EndpointInterface<R>
{
  readonly t!: R;
  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'post';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters({});
  }

  path(): string {
    return '/openApi/swap/v2/trade/closeAllPositions';
  }
}
