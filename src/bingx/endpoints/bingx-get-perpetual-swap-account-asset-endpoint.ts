import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { ApiKeyHeader } from 'bingx-api/bingx/headers/api-key-header';
import { SignatureInterface } from 'bingx-api/bingx/account/signature.interface';
import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { DefaultSignatureParameters } from 'bingx-api/bingx/account/default-signature-parameters';
import { SignatureParametersInterface } from 'bingx-api/bingx/account/signature-parameters.interface';
import { BingxResponse } from 'bingx-api/bingx';

export interface BalanceData {
  balance: {
    userId: string;
    asset: 'USDT';
    balance: string;
    equity: string;
    unrealizedProfit: string;
    realisedProfit: string;
    availableMargin: string;
    usedMargin: string;
    freezedMargin: string;
  };
}

export class BingxGetPerpetualSwapAccountAssetEndpoint<R = BalanceData>
  implements EndpointInterface<BingxResponse<R>>
{
  constructor(private readonly account: AccountInterface) {}

  apiKey(): ApiKeyHeader {
    return new ApiKeyHeader(this.account.getApiKey());
  }

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'get';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters();
  }

  path(): string {
    return '/openApi/swap/v2/user/balance';
  }

  signature(): SignatureInterface {
    return this.account.sign(this.parameters());
  }

  readonly t!: BingxResponse<R>;
}
