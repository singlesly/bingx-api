import { EndpointInterface } from '@app/bingx/request/endpoint.interface';
import { ApiKeyHeader } from '@app/bingx/headers/api-key-header';
import { SignatureInterface } from '@app/bingx/account/signature.interface';
import { Throughput } from '@app/bingx/rate-limit/throughput';
import { AccountInterface } from '@app/bingx/account/account.interface';
import { DefaultSignatureParameters } from '@app/bingx/account/default-signature-parameters';
import { SignatureParametersInterface } from '@app/bingx/account/signature-parameters.interface';
import { AccountThroughput } from '@app/bingx/rate-limit/account-throughput';

export class BingxUserBalanceEndpoint implements EndpointInterface {
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

  throughput(): Throughput {
    return new AccountThroughput();
  }
}
