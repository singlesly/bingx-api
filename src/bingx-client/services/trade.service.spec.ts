import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { BingxBulkOrderEndpoint } from 'bingx-api/bingx/endpoints/bingx-bulk-order-endpoint';
import { OrderPositionSideEnum } from 'bingx-api/bingx/enums/order-position-side.enum';
import { OrderSideEnum } from 'bingx-api/bingx/enums/order-side.enum';
import { OrderTypeEnum } from 'bingx-api/bingx/enums/order-type.enum';
import { BingxCreateTradeOrderInterface } from 'bingx-api/bingx/interfaces/trade-order.interface';
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
  describe('bulkOrder', () => {
    it('dispatches the bulk order endpoint', async () => {
      const executor = new TestRequestExecutor();
      const service = new TradeService(executor);
      const orders: BingxCreateTradeOrderInterface[] = [
        {
          symbol: 'ETH-USDT',
          type: OrderTypeEnum.MARKET,
          side: OrderSideEnum.BUY,
          positionSide: OrderPositionSideEnum.LONG,
          quantity: '1',
        },
        {
          symbol: 'BTC-USDT',
          type: OrderTypeEnum.MARKET,
          side: OrderSideEnum.BUY,
          positionSide: OrderPositionSideEnum.LONG,
          quantity: '0.001',
        },
      ];

      await service.bulkOrder(orders, account, 5000);

      const endpoint = executor.endpoint as BingxBulkOrderEndpoint;
      const parameters = endpoint.parameters().asRecord();

      expect(endpoint).toBeInstanceOf(BingxBulkOrderEndpoint);
      expect(endpoint.method()).toBe('post');
      expect(endpoint.path()).toBe('/openApi/swap/v2/trade/batchOrders');
      expect(JSON.parse(parameters.batchOrders)).toEqual(orders);
      expect(parameters.recvWindow).toBe('5000');
      expect(parameters.timestamp).toBeDefined();
    });

    it('omits recvWindow when it is not provided', async () => {
      const endpoint = new BingxBulkOrderEndpoint(
        [
          {
            symbol: 'ETH-USDT',
            type: OrderTypeEnum.MARKET,
            side: OrderSideEnum.BUY,
            quantity: '1',
          },
        ],
        account,
      );

      expect(endpoint.parameters().asRecord().recvWindow).toBeUndefined();
    });
  });
});
