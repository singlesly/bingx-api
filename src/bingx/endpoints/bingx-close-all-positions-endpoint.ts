import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { SignatureParametersInterface } from 'bingx-api/bingx/account/signature-parameters.interface';
import { DefaultSignatureParameters } from 'bingx-api/bingx/account/default-signature-parameters';

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
