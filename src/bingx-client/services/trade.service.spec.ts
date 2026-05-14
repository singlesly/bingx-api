import { ApiAccount } from 'bingx-api/bingx/account/api-account';
import { OrderPositionSideEnum } from 'bingx-api/bingx/enums/order-position-side.enum';
import { OrderSideEnum } from 'bingx-api/bingx/enums/order-side.enum';
import { OrderTypeEnum } from 'bingx-api/bingx/enums/order-type.enum';
import { BingxCreateTradeOrderInterface } from 'bingx-api/bingx/interfaces/trade-order.interface';
import { BingxTradeOrderEndpoint } from 'bingx-api/bingx/endpoints/bingx-trade-order-endpoint';
import { BingxTradeOrderTestEndpoint } from 'bingx-api/bingx/endpoints/bingx-trade-order-test-endpoint';
import { TradeService } from 'bingx-api/bingx-client/services/trade.service';

describe('TradeService', () => {
  const account = new ApiAccount('api-key', 'secret-key');
  const order: BingxCreateTradeOrderInterface = {
    clientOrderID: 'client-order-id',
    side: OrderSideEnum.BUY,
    positionSide: OrderPositionSideEnum.LONG,
    price: '30000',
    quantity: '0.001',
    symbol: 'BTC-USDT',
    type: OrderTypeEnum.MARKET,
  };

  it('executes trade order endpoint for live orders', async () => {
    const requestExecutorMock = {
      execute: jest.fn().mockResolvedValue({}),
    };
    const service = new TradeService(requestExecutorMock);

    await expect(service.tradeOrder(order, account)).resolves.toEqual({});

    expect(requestExecutorMock.execute).toHaveBeenCalledWith(
      expect.any(BingxTradeOrderEndpoint),
    );
  });

  it('executes trade order test endpoint for test orders', async () => {
    const requestExecutorMock = {
      execute: jest.fn().mockResolvedValue({}),
    };
    const service = new TradeService(requestExecutorMock);

    await expect(service.createTradeOrderTest(order, account)).resolves.toEqual(
      {},
    );

    expect(requestExecutorMock.execute).toHaveBeenCalledWith(
      expect.any(BingxTradeOrderTestEndpoint),
    );
  });
});
