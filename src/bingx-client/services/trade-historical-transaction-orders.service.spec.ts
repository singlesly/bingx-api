import { TradeService } from 'bingx-api/bingx-client/services/trade.service';
import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { RequestExecutorInterface } from 'bingx-api/bingx/request-executor/request-executor.interface';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { BingxHistoricalTransactionOrdersEndpoint } from 'bingx-api/bingx/endpoints/bingx-historical-transaction-orders-endpoint';

describe('trade historical transaction orders service', () => {
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

  it('dispatches the signed historical transaction orders endpoint', async () => {
    const service = new TradeService(requestExecutor);
    const startTs = new Date('2026-01-02T03:04:05.006Z');
    const endTs = 1770000000000;

    const endpoint = (await service.getHistoricalTransactionOrders(
      {
        symbol: 'WLD-USDT',
        currency: 'USDT',
        orderId: '1736007768311123456',
        tradingUnit: 'COIN',
        startTs,
        endTs,
        recvWindow: 5000,
      },
      account,
    )) as unknown as BingxHistoricalTransactionOrdersEndpoint;

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(capturedEndpoints[0]).toBe(endpoint);
    expect(endpoint).toBeInstanceOf(BingxHistoricalTransactionOrdersEndpoint);
    expect(endpoint.method()).toBe('get');
    expect(endpoint.path()).toBe('/openApi/swap/v2/trade/allFillOrders');
    expect(endpoint.parameters().asRecord()).toEqual({
      tradingUnit: 'COIN',
      startTs: startTs.getTime().toString(10),
      endTs: endTs.toString(10),
      symbol: 'WLD-USDT',
      currency: 'USDT',
      orderId: '1736007768311123456',
      recvWindow: '5000',
      timestamp: '1770000000123',
    });
  });

  it('omits optional filters when only required history options are provided', () => {
    const endpoint = new BingxHistoricalTransactionOrdersEndpoint(
      {
        tradingUnit: 'CONT',
        startTs: 1770000000000,
        endTs: 1770000001000,
      },
      account,
    );

    expect(endpoint.parameters().asRecord()).toEqual({
      tradingUnit: 'CONT',
      startTs: '1770000000000',
      endTs: '1770000001000',
      timestamp: '1770000000123',
    });
  });
});
