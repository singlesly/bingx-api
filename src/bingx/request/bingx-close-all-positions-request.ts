import { BingxRequestInterface } from '@app/bingx/request/bingx-request.interface';
import { BingxResponseInterface } from '@app/bingx/request/bingx-response.interface';
import { BingxCloseAllPositionsEndpoint } from '@app/bingx/request/bingx-close-all-positions-endpoint';
import { BingxRequest } from '@app/bingx/request/bingx-request';
import { AccountInterface } from '@app/bingx/account/account.interface';

export interface BingxCloseAllPositionsData {
  success: number[];
  failed: number[];
}

export class BingxCloseAllPositionsRequest
  implements
    BingxRequestInterface<BingxResponseInterface<BingxCloseAllPositionsData>>
{
  private readonly request = new BingxRequest<
    BingxResponseInterface<BingxCloseAllPositionsData>
  >(new BingxCloseAllPositionsEndpoint(this.account));

  constructor(private readonly account: AccountInterface) {}

  getResponse(): Promise<BingxResponseInterface<BingxCloseAllPositionsData>> {
    return this.request.getResponse();
  }
}
