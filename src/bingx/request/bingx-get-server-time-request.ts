import { BingxRequestInterface } from '@app/bingx/request/bingx-request.interface';
import { BingxGetServerTimeEndpoint } from '@app/bingx/request/bingx-get-server-time-endpoint';
import { BingxResponseInterface } from '@app/bingx/request/bingx-response.interface';
import { AccountInterface } from '@app/bingx/account/account.interface';
import { BingxRequest } from '@app/bingx/request/bingx-request';

export interface BingxGetServerTimeResponseData {
  serverTime: number;
}

export class BingxGetServerTimeRequest
  implements
    BingxRequestInterface<BingxResponseInterface<BingxGetServerTimeEndpoint>>
{
  private readonly request = new BingxRequest<
    BingxResponseInterface<BingxGetServerTimeEndpoint>
  >(new BingxGetServerTimeEndpoint(this.account));

  constructor(private readonly account: AccountInterface) {}

  getResponse(): Promise<BingxResponseInterface<BingxGetServerTimeEndpoint>> {
    return this.request.getResponse();
  }
}
