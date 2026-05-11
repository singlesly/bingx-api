import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { BingxTradeOrderTestEndpoint } from 'bingx-api/bingx/endpoints/bingx-trade-order-test-endpoint';
import { OrderSideEnum, OrderTypeEnum } from 'bingx-api/bingx/enums';
import { BingxCreateTradeOrderInterface } from 'bingx-api/bingx/interfaces/trade-order.interface';
import { RequestExecutorInterface } from 'bingx-api/bingx/request-executor/request-executor.interface';
import { TradeService } from 'bingx-api/bingx-client/services/trade.service';

describe('TradeService', () => {
  describe('createTradeOrderTest', () => {
    it('executes the test order endpoint with the order payload', async () => {
      const requestExecutor: jest.Mocked<RequestExecutorInterface> = {
        execute: jest.fn().mockResolvedValue({ code: 0, data: {} }),
      };
      const account: AccountInterface = {
        getApiKey: jest.fn().mockReturnValue('api-key'),
        sign: jest.fn().mockReturnValue({
          toString: () => 'signature',
          secretKey: () => 'secret',
        }),
      };
      const order: BingxCreateTradeOrderInterface = {
        symbol: 'BTC-USDT',
        type: OrderTypeEnum.MARKET,
        side: OrderSideEnum.BUY,
        quantity: '0.01',
      };

      await new TradeService(requestExecutor).createTradeOrderTest(
        order,
        account,
      );

      expect(requestExecutor.execute).toHaveBeenCalledTimes(1);

      const endpoint = requestExecutor.execute.mock.calls[0][0];
      expect(endpoint).toBeInstanceOf(BingxTradeOrderTestEndpoint);
      expect(endpoint.path()).toBe('/openApi/swap/v2/trade/order/test');
      expect(endpoint.method()).toBe('post');
      expect(endpoint.parameters().asRecord()).toEqual(
        expect.objectContaining(order),
      );
    });
  });
});
