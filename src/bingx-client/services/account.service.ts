import { RequestExecutorInterface } from '@app/bingx/request-executor/request-executor.interface';
import { AccountInterface } from '@app/bingx/account/account.interface';
import { BingxGetPerpetualSwapAccountAssetEndpoint } from '@app/bingx/endpoints/bingx-get-perpetual-swap-account-asset-endpoint';
import { BingxPerpetualSwapPositionsEndpoint } from '@app/bingx/endpoints/bingx-perpetual-swap-positions-endpoint';

export class AccountService {
  constructor(private readonly requestExecutor: RequestExecutorInterface) {}

  public getPerpetualSwapAccountAssetInformation(account: AccountInterface) {
    return this.requestExecutor.execute(
      new BingxGetPerpetualSwapAccountAssetEndpoint(account),
    );
  }

  public getPerpetualSwapPositions(symbol: string, account: AccountInterface) {
    return this.requestExecutor.execute(
      new BingxPerpetualSwapPositionsEndpoint(symbol, account),
    );
  }
}
