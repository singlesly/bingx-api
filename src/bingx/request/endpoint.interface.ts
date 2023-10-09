import { SignatureInterface } from '@app/bingx/account/signature.interface';
import { Throughput } from '@app/bingx/rate-limit/throughput';
import { ApiKeyHeader } from '@app/bingx/headers/api-key-header';
import { SignatureParametersInterface } from '@app/bingx/account/signature-parameters.interface';

export interface EndpointInterface {
  path(): string;
  method(): 'get' | 'post' | 'put' | 'patch' | 'delete';
  parameters(): SignatureParametersInterface;
  signature(): SignatureInterface;
  apiKey(): ApiKeyHeader;
  throughput(): Throughput;
}
