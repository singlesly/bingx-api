import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { BingxAdjustIsolatedMarginEndpoint } from 'bingx-api/bingx/endpoints/bingx-adjust-isolated-margin-endpoint';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { OrderPositionSideEnum } from 'bingx-api/bingx/enums/order-position-side.enum';
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
  describe('adjustIsolatedMargin', () => {
    it('dispatches the adjust isolated margin endpoint', async () => {
      const executor = new TestRequestExecutor();
      const service = new TradeService(executor);

      await service.adjustIsolatedMargin(
        {
          symbol: 'BTC-USDT',
          amount: '25.5',
          type: 1,
          positionSide: OrderPositionSideEnum.LONG,
          positionId: '123456789',
          recvWindow: '5000',
        },
        account,
      );

      const endpoint = executor.endpoint as BingxAdjustIsolatedMarginEndpoint;
      const parameters = endpoint.parameters().asRecord();

      expect(endpoint).toBeInstanceOf(BingxAdjustIsolatedMarginEndpoint);
      expect(endpoint.method()).toBe('post');
      expect(endpoint.path()).toBe('/openApi/swap/v2/trade/positionMargin');
      expect(parameters).toMatchObject({
        symbol: 'BTC-USDT',
        amount: '25.5',
        type: '1',
        positionSide: OrderPositionSideEnum.LONG,
        positionId: '123456789',
        recvWindow: '5000',
      });
      expect(parameters.timestamp).toBeDefined();
    });

    it('omits optional parameters when they are not provided', async () => {
      const endpoint = new BingxAdjustIsolatedMarginEndpoint(
        {
          symbol: 'ETH-USDT',
          amount: 10,
          type: 2,
        },
        account,
      );
      const parameters = endpoint.parameters().asRecord();

      expect(parameters).toMatchObject({
        symbol: 'ETH-USDT',
        amount: '10',
        type: '2',
      });
      expect(parameters.positionSide).toBeUndefined();
      expect(parameters.positionId).toBeUndefined();
      expect(parameters.recvWindow).toBeUndefined();
    });
  });
});
