import { RequestExecutorInterface } from '@app/bingx/request-executor/request-executor.interface';
import { BingxCreateTradeOrderInterface } from '@app/bingx/interfaces/trade-order.interface';
import { AccountInterface } from '@app/bingx/account/account.interface';
import { BingxTradeOrderEndpoint } from '@app/bingx/endpoints/bingx-trade-order-endpoint';
import { BingxCloseAllPositionsEndpoint } from '@app/bingx/endpoints/bingx-close-all-positions-endpoint';
import { BingxCancelAllOrdersEndpoint } from '@app/bingx/endpoints/bingx-cancel-all-orders-endpoint';
import {
  BingxSwitchMarginModeEndpoint,
  MarginType,
} from '@app/bingx/endpoints/bingx-switch-margin-mode-endpoint';
import { BingxSwitchLeverageEndpoint } from '@app/bingx/endpoints/bingx-switch-leverage-endpoint';
import { OrderPositionSideEnum } from '@app/bingx';

export class TradeService {
  constructor(private readonly requestExecutor: RequestExecutorInterface) {}

  public async tradeOrder(
    order: BingxCreateTradeOrderInterface,
    account: AccountInterface,
  ) {
    return this.requestExecutor.execute(
      new BingxTradeOrderEndpoint(order, account),
    );
  }

  public closeAllPositions(account: AccountInterface) {
    return this.requestExecutor.execute(
      new BingxCloseAllPositionsEndpoint(account),
    );
  }

  public cancelAllOrders(symbol: string, account: AccountInterface) {
    return this.requestExecutor.execute(
      new BingxCancelAllOrdersEndpoint(symbol, account),
    );
  }

  public switchMarginMode(
    symbol: string,
    marginType: MarginType,
    account: AccountInterface,
  ) {
    return this.requestExecutor.execute(
      new BingxSwitchMarginModeEndpoint(symbol, marginType, account),
    );
  }

  public switchLeverage(
    symbol: string,
    leverage: number,
    side: OrderPositionSideEnum,
    account: AccountInterface,
  ) {
    return this.requestExecutor.execute(
      new BingxSwitchLeverageEndpoint(symbol, leverage, side, account),
    );
  }
}
