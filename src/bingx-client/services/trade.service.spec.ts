import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { BingxQueryMarginModeEndpoint } from 'bingx-api/bingx/endpoints/bingx-query-margin-mode-endpoint';
import { TradeService } from 'bingx-api/bingx-client/services/trade.service';

const account: AccountInterface = {
  getApiKey: jest.fn().mockReturnValue('api-key'),
  sign: jest.fn(),
};

describe('BingxQueryMarginModeEndpoint', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1700000000000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('describes the query margin mode endpoint', () => {
    const endpoint = new BingxQueryMarginModeEndpoint('BTC-USDT', account);

    expect(endpoint.method()).toBe('get');
    expect(endpoint.path()).toBe('/openApi/swap/v2/trade/marginType');
    expect(endpoint.parameters().asRecord()).toEqual({
      symbol: 'BTC-USDT',
      timestamp: '1700000000000',
    });
  });
});

describe('TradeService.queryMarginMode', () => {
  it('executes a query margin mode endpoint', async () => {
    const response = {
      code: 0,
      msg: '',
      data: { symbol: 'BTC-USDT', marginType: 'CROSSED' },
    };
    const requestExecutor = {
      execute: jest.fn().mockResolvedValue(response),
    };
    const service = new TradeService(requestExecutor);

    await expect(service.queryMarginMode('BTC-USDT', account)).resolves.toBe(
      response,
    );

    expect(requestExecutor.execute).toHaveBeenCalledTimes(1);
    expect(requestExecutor.execute).toHaveBeenCalledWith(
      expect.any(BingxQueryMarginModeEndpoint),
    );
  });
});
