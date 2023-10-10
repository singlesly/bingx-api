import { SignatureInterface } from '@app/bingx/account/signature.interface';
import { ApiKeyHeader } from '@app/bingx/headers/api-key-header';
import { SignatureParametersInterface } from '@app/bingx/account/signature-parameters.interface';

export interface EndpointInterface<R = unknown> {
  readonly t: R;
  path(): string;
  method(): 'get' | 'post' | 'put' | 'patch' | 'delete';
  parameters(): SignatureParametersInterface;
  signature(): SignatureInterface;
  apiKey(): ApiKeyHeader;
}
