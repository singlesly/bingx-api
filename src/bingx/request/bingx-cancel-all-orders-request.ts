import { BingxRequestInterface } from '@app/bingx/request/bingx-request.interface';
import { BingxResponseInterface } from '@app/bingx/request/bingx-response.interface';
import { BingxCancelAllOrdersEndpoint } from '@app/bingx/request/bingx-cancel-all-orders-endpoint';
import { BingxRequest } from '@app/bingx/request/bingx-request';
import { AccountInterface } from '@app/bingx/account/account.interface';

export interface CancelAllOrdersData {
  success: unknown[];
  failed: unknown[];
}

export class BingxCancelAllOrdersRequest
  implements BingxRequestInterface<BingxResponseInterface<CancelAllOrdersData>>
{
  private readonly request = new BingxRequest<
    BingxResponseInterface<CancelAllOrdersData>
  >(new BingxCancelAllOrdersEndpoint(this.symbol, this.account));

  constructor(
    private readonly symbol: string,
    private readonly account: AccountInterface,
  ) {}

  getResponse(): Promise<BingxResponseInterface<CancelAllOrdersData>> {
    return this.request.getResponse();
  }
}
