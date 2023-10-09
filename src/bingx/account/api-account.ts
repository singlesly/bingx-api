import { AccountInterface } from '@app/bingx/account/account.interface';
import { SignatureParametersInterface } from '@app/bingx/account/signature-parameters.interface';
import { SignatureInterface } from '@app/bingx/account/signature.interface';
import * as crypto from 'crypto';

export class ApiAccount implements AccountInterface {
  constructor(
    private readonly apiKey: string,
    private readonly secretKey: string,
  ) {}

  getApiKey(): string {
    return this.apiKey;
  }
  sign(parameters: SignatureParametersInterface): SignatureInterface {
    const message = Object.entries(parameters.asRecord())
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    return {
      toString: () => {
        return crypto
          .createHmac('sha256', this.secretKey)
          .update(message)
          .digest('hex');
      },
      secretKey: () => {
        return this.secretKey;
      },
    };
  }
}
