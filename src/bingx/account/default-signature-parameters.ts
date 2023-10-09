import { SignatureParametersInterface } from '@app/bingx/account/signature-parameters.interface';

export class DefaultSignatureParameters
  implements SignatureParametersInterface
{
  constructor(
    private readonly parameters:
      | Record<string, string>
      | string
      | URLSearchParams = {},
    private readonly overrideTimestamp: number = Date.now(),
  ) {}

  asRecord(): Record<string, string> {
    return {
      ...Object.fromEntries(new URLSearchParams(this.parameters).entries()),
      timestamp: this.overrideTimestamp.toString(10),
    };
  }
}
