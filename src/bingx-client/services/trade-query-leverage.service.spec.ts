import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { BingxQueryLeverageEndpoint } from 'bingx-api/bingx/endpoints/bingx-query-leverage-endpoint';
import { TradeService } from 'bingx-api/bingx-client/services/trade.service';

const account: AccountInterface = {
  getApiKey: jest.fn().mockReturnValue('api-key'),
  sign: jest.fn(),
};

describe('BingxQueryLeverageEndpoint', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1700000000000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('describes the query leverage endpoint', () => {
    const endpoint = new BingxQueryLeverageEndpoint('BTC-USDT', account, 5000);

    expect(endpoint.method()).toBe('get');
    expect(endpoint.path()).toBe('/openApi/swap/v2/trade/leverage');
    expect(endpoint.parameters().asRecord()).toEqual({
      symbol: 'BTC-USDT',
      recvWindow: '5000',
      timestamp: '1700000000000',
    });
  });
});

describe('TradeService.queryLeverage', () => {
  it('executes a query leverage endpoint', async () => {
    const response = {
      code: 0,
      msg: '',
      data: {
        longLeverage: 20,
        shortLeverage: 10,
      },
    };
    const requestExecutor = {
      execute: jest.fn().mockResolvedValue(response),
    };
    const service = new TradeService(requestExecutor);

    await expect(service.queryLeverage('BTC-USDT', account)).resolves.toBe(
      response,
    );

    expect(requestExecutor.execute).toHaveBeenCalledTimes(1);
    expect(requestExecutor.execute).toHaveBeenCalledWith(
      expect.any(BingxQueryLeverageEndpoint),
    );
  });
});
