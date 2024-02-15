import { RequestExecutorInterface } from 'bingx-api/bingx/request-executor/request-executor.interface';
import { BingxCreateTradeOrderInterface } from 'bingx-api/bingx/interfaces/trade-order.interface';
import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { BingxTradeOrderEndpoint } from 'bingx-api/bingx/endpoints/bingx-trade-order-endpoint';
import { BingxCloseAllPositionsEndpoint } from 'bingx-api/bingx/endpoints/bingx-close-all-positions-endpoint';
import { BingxCancelAllOrdersEndpoint } from 'bingx-api/bingx/endpoints/bingx-cancel-all-orders-endpoint';
import {
  BingxSwitchMarginModeEndpoint,
  MarginType,
} from 'bingx-api/bingx/endpoints/bingx-switch-margin-mode-endpoint';
import { BingxSwitchLeverageEndpoint } from 'bingx-api/bingx/endpoints/bingx-switch-leverage-endpoint';
import { OrderPositionSideEnum } from 'bingx-api/bingx';
import { BingxUserHistoryOrdersEndpoint } from 'bingx-api/bingx/endpoints/bingx-user-history-orders-endpoint';
import { BingxCancelOrderEndpoint } from 'bingx-api/bingx/endpoints/bingx-cancel-order-endpoint';

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

  public async createTradeOrderTest(
    order: BingxCreateTradeOrderInterface,
    account: AccountInterface,
  ) {
    return this.requestExecutor.execute(
      new BingxTradeOrderEndpoint(order, account),
    );
  }

  public async cancelOrder(
    orderId: string,
    symbol: string,
    account: AccountInterface,
  ) {
    return this.requestExecutor.execute(
      new BingxCancelOrderEndpoint(account, orderId, symbol),
    );
  }

  public async getUserHistoryOrders(
    symbol: string,
    limit: number,
    startTime: Date,
    endTime: Date,
    account: AccountInterface,
  ) {
    return this.requestExecutor.execute(
      new BingxUserHistoryOrdersEndpoint(
        symbol,
        limit,
        startTime,
        endTime,
        account,
      ),
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
