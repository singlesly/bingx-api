import { SignatureParametersInterface } from 'bingx-api/bingx/account/signature-parameters.interface';

export class SignatureParameters implements SignatureParametersInterface {
  constructor(
    private readonly parameters:
      | Record<string, string>
      | string
      | URLSearchParams,
  ) {}

  asRecord(): Record<string, string> {
    return Object.fromEntries(new URLSearchParams(this.parameters).entries());
  }
}
