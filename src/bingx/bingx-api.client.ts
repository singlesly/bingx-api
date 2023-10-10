import { RequestExecutorInterface } from '@app/bingx/request-executor/request-executor.interface';
import { ListenKeyService } from '@app/bingx/services/listen-key.service';
import { TradeService } from '@app/bingx/services/trade.service';

export class BingxApiClient {
  private readonly services = {
    [ListenKeyService.constructor.name]: new ListenKeyService(
      this.requestExecutor,
    ),
    [TradeService.constructor.name]: new TradeService(this.requestExecutor),
  };

  constructor(private readonly requestExecutor: RequestExecutorInterface) {}

  public getListenKeyService() {
    return this.services[ListenKeyService.constructor.name];
  }
}
