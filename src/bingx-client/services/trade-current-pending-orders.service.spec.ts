import { TradeService } from 'bingx-api/bingx-client/services/trade.service';
import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { RequestExecutorInterface } from 'bingx-api/bingx/request-executor/request-executor.interface';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { BingxCurrentPendingOrdersEndpoint } from 'bingx-api/bingx/endpoints/bingx-current-pending-orders-endpoint';

describe('trade current pending orders service', () => {
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

  it('dispatches the signed current pending orders endpoint', async () => {
    const service = new TradeService(requestExecutor);

    const endpoint = (await service.getCurrentPendingOrders(
      {
        symbol: 'BTC-USDT',
        type: 'LIMIT',
        recvWindow: 5000,
      },
      account,
    )) as unknown as BingxCurrentPendingOrdersEndpoint;

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(capturedEndpoints[0]).toBe(endpoint);
    expect(endpoint).toBeInstanceOf(BingxCurrentPendingOrdersEndpoint);
    expect(endpoint.method()).toBe('get');
    expect(endpoint.path()).toBe('/openApi/swap/v2/trade/openOrders');
    expect(endpoint.parameters().asRecord()).toEqual({
      symbol: 'BTC-USDT',
      type: 'LIMIT',
      recvWindow: '5000',
      timestamp: '1770000000123',
    });
  });

  it('omits optional filters when no pending order options are provided', () => {
    const endpoint = new BingxCurrentPendingOrdersEndpoint({}, account);

    expect(endpoint.parameters().asRecord()).toEqual({
      timestamp: '1770000000123',
    });
  });
});
