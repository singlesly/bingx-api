import { BingxRequestInterface } from '@app/bingx/request/bingx-request.interface';
import { BingxResponseInterface } from '@app/bingx/request/bingx-response.interface';
import { AccountInterface } from '@app/bingx/account/account.interface';
import { BingxRequest } from '@app/bingx/request/bingx-request';
import { BingxUserBalanceEndpoint } from '@app/bingx/request/bingx-user-balance-endpoint';

export interface BalanceData {
  balance: {
    userId: string;
    asset: 'USDT';
    balance: string;
    equity: string;
    unrealizedProfit: string;
    realisedProfit: string;
    availableMargin: string;
    usedMargin: string;
    freezedMargin: string;
  };
}

export class BingxUserBalanceRequest
  implements BingxRequestInterface<BingxResponseInterface<BalanceData>>
{
  private readonly request = new BingxRequest<
    BingxResponseInterface<BalanceData>
  >(new BingxUserBalanceEndpoint(this.account));

  constructor(private readonly account: AccountInterface) {}

  async getResponse(): Promise<BingxResponseInterface<BalanceData>> {
    return this.request.getResponse();
  }
}
