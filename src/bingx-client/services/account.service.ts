import { RequestExecutorInterface } from 'bingx-api/bingx/request-executor/request-executor.interface';
import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { BingxGetPerpetualSwapAccountAssetEndpoint } from 'bingx-api/bingx/endpoints/bingx-get-perpetual-swap-account-asset-endpoint';
import { BingxPerpetualSwapPositionsEndpoint } from 'bingx-api/bingx/endpoints/bingx-perpetual-swap-positions-endpoint';
import { BingxUserFeeRateEndpoint } from 'bingx-api/bingx/endpoints/bingx-user-fee-rate-endpoint';

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

  public getUserFeeRate(account: AccountInterface, symbol?: string) {
    return this.requestExecutor.execute(
      new BingxUserFeeRateEndpoint(account, symbol),
    );
  }
}
