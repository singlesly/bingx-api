import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { ApiKeyHeader } from 'bingx-api/bingx/headers/api-key-header';
import { SignatureParametersInterface } from 'bingx-api/bingx/account/signature-parameters.interface';
import { SignatureInterface } from 'bingx-api/bingx/account/signature.interface';
import { AccountInterface } from 'bingx-api/bingx/account/account.interface';

export abstract class Endpoint<R = unknown> implements EndpointInterface<R> {
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

  abstract readonly t: R;
}
