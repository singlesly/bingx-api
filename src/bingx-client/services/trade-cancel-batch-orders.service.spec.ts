import { TradeService } from 'bingx-api/bingx-client/services/trade.service';
import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { RequestExecutorInterface } from 'bingx-api/bingx/request-executor/request-executor.interface';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { BingxCancelBatchOrdersEndpoint } from 'bingx-api/bingx/endpoints/bingx-cancel-batch-orders-endpoint';

describe('trade cancel batch orders service', () => {
  let account: AccountInterface;
  let capturedEndpoints: EndpointInterface<unknown>[];
  let requestExecutor: RequestExecutorInterface;
  let executeSpy: jest.SpyInstance;
  let nowSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    account = {
      getApiKey: jest.fn(() => 'api-key'),
      sign: jest.fn(() => ({
        toString: () => 'signature',
        secretKey: () => 'secret-key',
      })),
    };

    capturedEndpoints = [];
    requestExecutor = {
      execute<T>(endpoint: EndpointInterface<T>): Promise<T> {
        capturedEndpoints.push(endpoint as EndpointInterface<unknown>);
        return Promise.resolve(endpoint as unknown as T);
      },
    };

    executeSpy = jest.spyOn(requestExecutor, 'execute');
    nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1770000000123);
  });

  afterEach(() => {
    nowSpy.mockRestore();
  });

  it('dispatches the signed cancel batch orders endpoint', async () => {
    const service = new TradeService(requestExecutor);

    const endpoint = (await service.cancelBatchOrders(
      {
        symbol: 'BTC-USDT',
        orderIdList: ['1735924831603391122', '1735924833239172233'],
        clientOrderIdList: ['abc1234567', 'abc2345678'],
        recvWindow: 5000,
      },
      account,
    )) as unknown as BingxCancelBatchOrdersEndpoint;

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(capturedEndpoints[0]).toBe(endpoint);
    expect(endpoint).toBeInstanceOf(BingxCancelBatchOrdersEndpoint);
    expect(endpoint.method()).toBe('delete');
    expect(endpoint.path()).toBe('/openApi/swap/v2/trade/batchOrders');
    expect(endpoint.parameters().asRecord()).toEqual({
      symbol: 'BTC-USDT',
      orderIdList: '[1735924831603391122,1735924833239172233]',
      clientOrderIdList: '["abc1234567","abc2345678"]',
      recvWindow: '5000',
      timestamp: '1770000000123',
    });
  });

  it('omits optional order lists when only the required symbol is provided', () => {
    const endpoint = new BingxCancelBatchOrdersEndpoint(
      { symbol: 'BTC-USDT' },
      account,
    );

    expect(endpoint.parameters().asRecord()).toEqual({
      symbol: 'BTC-USDT',
      timestamp: '1770000000123',
    });
  });
});
