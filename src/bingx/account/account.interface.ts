import { SignatureInterface } from 'bingx-api/bingx/account/signature.interface';
import { SignatureParametersInterface } from 'bingx-api/bingx/account/signature-parameters.interface';
export interface AccountInterface {
  getApiKey(): string;
  sign(parameters: SignatureParametersInterface): SignatureInterface;
}
