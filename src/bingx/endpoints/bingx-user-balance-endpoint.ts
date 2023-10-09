import { EndpointInterface } from '@app/bingx/endpoints/endpoint.interface';
import { ApiKeyHeader } from '@app/bingx/headers/api-key-header';
import { SignatureInterface } from '@app/bingx/account/signature.interface';
import { AccountInterface } from '@app/bingx/account/account.interface';
import { DefaultSignatureParameters } from '@app/bingx/account/default-signature-parameters';
import { SignatureParametersInterface } from '@app/bingx/account/signature-parameters.interface';

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

export class BingxUserBalanceEndpoint<R = BalanceData>
  implements EndpointInterface<R>
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

  readonly t!: R;
}
