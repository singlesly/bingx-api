import { RequestExecutorInterface } from 'bingx-api/bingx/request-executor/request-executor.interface';
import { ListenKeyService } from 'bingx-api/bingx-client/services/listen-key.service';
import { TradeService } from 'bingx-api/bingx-client/services/trade.service';
import { AccountService } from 'bingx-api/bingx-client/services/account.service';

export class BingxApiClient {
  private readonly services = {
    [ListenKeyService.name]: new ListenKeyService(this.requestExecutor),
    [TradeService.name]: new TradeService(this.requestExecutor),
    [AccountService.name]: new AccountService(this.requestExecutor),
  };

  constructor(private readonly requestExecutor: RequestExecutorInterface) {}

  public getListenKeyService(): ListenKeyService {
    return this.services[ListenKeyService.name] as ListenKeyService;
  }

  public getTradeService(): TradeService {
    return this.services[TradeService.name] as TradeService;
  }

  public getAccountService(): AccountService {
    return this.services[AccountService.name] as AccountService;
  }
}
