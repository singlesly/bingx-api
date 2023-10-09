import { SignatureInterface } from '@app/bingx/account/signature.interface';
import { SignatureParametersInterface } from '@app/bingx/account/signature-parameters.interface';
export interface AccountInterface {
  getApiKey(): string;
  sign(parameters: SignatureParametersInterface): SignatureInterface;
}
