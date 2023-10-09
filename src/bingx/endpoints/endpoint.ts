import { EndpointInterface } from '@app/bingx/endpoints/endpoint.interface';
import { ApiKeyHeader } from '@app/bingx/headers/api-key-header';
import { SignatureParametersInterface } from '@app/bingx/account/signature-parameters.interface';
import { SignatureInterface } from '@app/bingx/account/signature.interface';
import { AccountInterface } from '@app/bingx/account/account.interface';

export abstract class Endpoint implements EndpointInterface {
  public constructor(protected readonly account: AccountInterface) {}

  apiKey(): ApiKeyHeader {
    return new ApiKeyHeader(this.account);
  }

  signature(): SignatureInterface {
    return this.account.sign(this.parameters());
  }

  abstract method(): 'get' | 'post' | 'put' | 'patch' | 'delete';

  abstract parameters(): SignatureParametersInterface;

  abstract path(): string;
}
