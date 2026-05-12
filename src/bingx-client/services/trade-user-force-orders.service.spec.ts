import { TradeService } from 'bingx-api/bingx-client/services/trade.service';
import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { RequestExecutorInterface } from 'bingx-api/bingx/request-executor/request-executor.interface';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { BingxUserForceOrdersEndpoint } from 'bingx-api/bingx/endpoints/bingx-user-force-orders-endpoint';

describe('trade user force orders service', () => {
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

  it('dispatches the signed user force orders endpoint', async () => {
    const service = new TradeService(requestExecutor);
    const startTime = new Date('2026-01-02T03:04:05.006Z');
    const endTime = 1770000000000;

    const endpoint = (await service.getUserForceOrders(
      {
        symbol: 'ATOM-USDT',
        currency: 'USDT',
        autoCloseType: 'LIQUIDATION',
        startTime,
        endTime,
        limit: 100,
        recvWindow: 5000,
      },
      account,
    )) as unknown as BingxUserForceOrdersEndpoint;

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(capturedEndpoints[0]).toBe(endpoint);
    expect(endpoint).toBeInstanceOf(BingxUserForceOrdersEndpoint);
    expect(endpoint.method()).toBe('get');
    expect(endpoint.path()).toBe('/openApi/swap/v2/trade/forceOrders');
    expect(endpoint.parameters().asRecord()).toEqual({
      symbol: 'ATOM-USDT',
      currency: 'USDT',
      autoCloseType: 'LIQUIDATION',
      startTime: startTime.getTime().toString(10),
      endTime: endTime.toString(10),
      limit: '100',
      recvWindow: '5000',
      timestamp: '1770000000123',
    });
  });

  it('omits optional filters when no force order options are provided', () => {
    const endpoint = new BingxUserForceOrdersEndpoint({}, account);

    expect(endpoint.parameters().asRecord()).toEqual({
      timestamp: '1770000000123',
    });
  });
});
