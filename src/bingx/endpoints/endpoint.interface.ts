import { SignatureInterface } from 'bingx-api/bingx/account/signature.interface';
import { ApiKeyHeader } from 'bingx-api/bingx/headers/api-key-header';
import { SignatureParametersInterface } from 'bingx-api/bingx/account/signature-parameters.interface';

export interface EndpointInterface<R = unknown> {
  readonly t: R;
  path(): string;
  method(): 'get' | 'post' | 'put' | 'patch' | 'delete';
  parameters(): SignatureParametersInterface;
  signature(): SignatureInterface;
  apiKey(): ApiKeyHeader;
}
