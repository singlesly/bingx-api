import { AccountService } from 'bingx-api/bingx-client/services/account.service';
import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { RequestExecutorInterface } from 'bingx-api/bingx/request-executor/request-executor.interface';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { BingxAccountProfitLossFundFlowEndpoint } from 'bingx-api/bingx/endpoints/bingx-account-profit-loss-fund-flow-endpoint';

describe('account income service', () => {
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

  it('dispatches the signed account profit and loss fund flow endpoint', async () => {
    const service = new AccountService(requestExecutor);
    const startTime = new Date('2026-01-02T03:04:05.006Z');
    const endTime = 1770000000000;

    const endpoint = (await service.getAccountProfitLossFundFlow(
      {
        symbol: 'BTC-USDT',
        incomeType: 'FUNDING_FEE',
        startTime,
        endTime,
        limit: 100,
        recvWindow: 5000,
      },
      account,
    )) as unknown as BingxAccountProfitLossFundFlowEndpoint;

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(capturedEndpoints[0]).toBe(endpoint);
    expect(endpoint).toBeInstanceOf(BingxAccountProfitLossFundFlowEndpoint);
    expect(endpoint.method()).toBe('get');
    expect(endpoint.path()).toBe('/openApi/swap/v2/user/income');
    expect(endpoint.parameters().asRecord()).toEqual({
      symbol: 'BTC-USDT',
      incomeType: 'FUNDING_FEE',
      startTime: startTime.getTime().toString(10),
      endTime: endTime.toString(10),
      limit: '100',
      recvWindow: '5000',
      timestamp: '1770000000123',
    });
  });

  it('omits optional filters when no fund flow options are provided', () => {
    const endpoint = new BingxAccountProfitLossFundFlowEndpoint({}, account);

    expect(endpoint.parameters().asRecord()).toEqual({
      timestamp: '1770000000123',
    });
  });
});
