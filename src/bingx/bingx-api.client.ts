import { RequestExecutorInterface } from '@app/bingx/request-executor/request-executor.interface';
import { ListenKeyService } from '@app/bingx/services/listen-key.service';

export class BingxApiClient {
  private readonly services = {
    [ListenKeyService.constructor.name]: new ListenKeyService(
      this.requestExecutor,
    ),
  };

  constructor(private readonly requestExecutor: RequestExecutorInterface) {}

  public getListenKeyService() {
    return this.services[ListenKeyService.constructor.name];
  }
}
