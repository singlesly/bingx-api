import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { DefaultSignatureParameters } from 'bingx-api/bingx/account/default-signature-parameters';
import { SignatureParametersInterface } from 'bingx-api/bingx/account/signature-parameters.interface';
import { Endpoint } from 'bingx-api/bingx/endpoints/endpoint';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import type { ResponseType } from 'axios';

export type BingxFundFlowIncomeType =
  | 'TRANSFER'
  | 'REALIZED_PNL'
  | 'FUNDING_FEE'
  | 'TRADING_FEE'
  | 'INSURANCE_CLEAR'
  | 'TRIAL_FUND'
  | 'ADL'
  | 'SYSTEM_DEDUCTION';

export interface BingxExportFundFlowOptions {
  symbol?: string;
  incomeType?: BingxFundFlowIncomeType | string;
  startTime?: Date | number;
  endTime?: Date | number;
  limit?: number;
  recvWindow?: number;
}

export type BingxExportFundFlowResponse = ArrayBuffer | Buffer;

export class BingxExportFundFlowEndpoint<R = BingxExportFundFlowResponse>
  extends Endpoint<R>
  implements EndpointInterface<R>
{
  constructor(
    private readonly options: BingxExportFundFlowOptions,
    account: AccountInterface,
  ) {
    super(account);
  }

  method(): 'get' | 'post' | 'put' | 'patch' | 'delete' {
    return 'get';
  }

  parameters(): SignatureParametersInterface {
    return new DefaultSignatureParameters(this.queryParameters());
  }

  path(): string {
    return '/openApi/swap/v2/user/income/export';
  }

  responseType(): ResponseType {
    return 'arraybuffer';
  }

  private queryParameters(): Record<string, string> {
    const parameters: Record<string, string> = {};

    this.setOptionalParameter(parameters, 'symbol', this.options.symbol);
    this.setOptionalParameter(
      parameters,
      'incomeType',
      this.options.incomeType,
    );
    this.setOptionalTimestamp(parameters, 'startTime', this.options.startTime);
    this.setOptionalTimestamp(parameters, 'endTime', this.options.endTime);
    this.setOptionalParameter(parameters, 'limit', this.options.limit);
    this.setOptionalParameter(
      parameters,
      'recvWindow',
      this.options.recvWindow,
    );

    return parameters;
  }

  private setOptionalParameter(
    parameters: Record<string, string>,
    name: string,
    value?: string | number,
  ) {
    if (value !== undefined) {
      parameters[name] = value.toString();
    }
  }

  private setOptionalTimestamp(
    parameters: Record<string, string>,
    name: string,
    value?: Date | number,
  ) {
    if (value instanceof Date) {
      parameters[name] = value.getTime().toString(10);
      return;
    }

    this.setOptionalParameter(parameters, name, value);
  }

  readonly t!: R;
}
