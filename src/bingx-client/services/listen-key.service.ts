import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { BingxExtendListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-extend-listen-key-endpoint';
import { BingxGenerateListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-generate-listen-key-endpoint';
import { BingxGenerateListenKeyResponse } from 'bingx-api/bingx/endpoints/bingx-generate-listen-key-response';
import { RequestExecutorInterface } from 'bingx-api/bingx/request-executor/request-executor.interface';

export class ListenKeyService {
  constructor(private readonly requestExecutor: RequestExecutorInterface) {}

  async generateListenKey(
    account: AccountInterface,
  ): Promise<BingxGenerateListenKeyResponse> {
    return this.requestExecutor.execute(
      new BingxGenerateListenKeyEndpoint(account),
    );
  }

  async extendListenKey(
    listenKey: string,
    account: AccountInterface,
  ): Promise<void> {
    return this.requestExecutor.execute(
      new BingxExtendListenKeyEndpoint(listenKey, account),
    );
  }
}
