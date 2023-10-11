import { AccountInterface } from '@app/bingx/account/account.interface';
import { BingxGenerateListenKeyEndpoint } from '@app/bingx/endpoints/bingx-generate-listen-key-endpoint';
import { BingxGenerateListenKeyResponse } from '@app/bingx/endpoints/bingx-generate-listen-key-response';
import { RequestExecutorInterface } from '@app/bingx/request-executor/request-executor.interface';
import { BingxResponseInterface } from '@app/bingx/endpoints/bingx-response.interface';

export class ListenKeyService {
  constructor(private readonly requestExecutor: RequestExecutorInterface) {}

  async generateListenKey(
    account: AccountInterface,
  ): Promise<BingxGenerateListenKeyResponse> {
    return this.requestExecutor.execute(
      new BingxGenerateListenKeyEndpoint(account),
    );
  }
}
