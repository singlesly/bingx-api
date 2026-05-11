import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { BingxQueryOrderEndpoint } from 'bingx-api/bingx/endpoints/bingx-query-order-endpoint';
import { RequestExecutorInterface } from 'bingx-api/bingx/request-executor/request-executor.interface';
import { TradeService } from 'bingx-api/bingx-client/services/trade.service';

class TestRequestExecutor implements RequestExecutorInterface {
  public endpoint?: EndpointInterface;

  execute<T>(endpoint: EndpointInterface<T>): Promise<T> {
    this.endpoint = endpoint;
    return Promise.resolve({} as T);
  }
}

const account: AccountInterface = {
  getApiKey: () => 'api-key',
  sign: () => ({
    toString: () => 'signature',
    secretKey: () => 'secret-key',
  }),
};

describe('TradeService', () => {
  describe('queryOrder', () => {
    it('dispatches the query order endpoint', async () => {
      const executor = new TestRequestExecutor();
      const service = new TradeService(executor);

      await service.queryOrder(
        {
          symbol: 'OP-USDT',
          orderId: '1736012449498123456',
          recvWindow: '5000',
        },
        account,
      );

      const endpoint = executor.endpoint as BingxQueryOrderEndpoint;
      const parameters = endpoint.parameters().asRecord();

      expect(endpoint).toBeInstanceOf(BingxQueryOrderEndpoint);
      expect(endpoint.method()).toBe('get');
      expect(endpoint.path()).toBe('/openApi/swap/v2/trade/order');
      expect(parameters).toMatchObject({
        symbol: 'OP-USDT',
        orderId: '1736012449498123456',
        recvWindow: '5000',
      });
      expect(parameters.timestamp).toBeDefined();
    });

    it('supports querying by client order id', async () => {
      const endpoint = new BingxQueryOrderEndpoint(
        {
          symbol: 'BTC-USDT',
          clientOrderId: 'client-order-id',
        },
        account,
      );

      expect(endpoint.parameters().asRecord()).toMatchObject({
        symbol: 'BTC-USDT',
        clientOrderId: 'client-order-id',
      });
    });
  });
});
