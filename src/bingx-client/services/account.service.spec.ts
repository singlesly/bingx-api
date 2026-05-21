import { ApiAccount } from 'bingx-api/bingx/account/api-account';
import { BingxUserFeeRateEndpoint } from 'bingx-api/bingx/endpoints/bingx-user-fee-rate-endpoint';
import { AccountService } from 'bingx-api/bingx-client/services/account.service';

describe('AccountService', () => {
  const account = new ApiAccount('api-key', 'secret-key');

  it('executes user fee rate endpoint', async () => {
    const requestExecutorMock = {
      execute: jest.fn().mockResolvedValue({}),
    };
    const service = new AccountService(requestExecutorMock);

    await expect(service.getUserFeeRate(account)).resolves.toEqual({});

    expect(requestExecutorMock.execute).toHaveBeenCalledWith(
      expect.any(BingxUserFeeRateEndpoint),
    );

    const endpoint = requestExecutorMock.execute.mock.calls[0][0];
    expect(endpoint.path()).toBe('/openApi/swap/v2/user/commissionRate');
    expect(endpoint.method()).toBe('get');
    expect(endpoint.parameters().asRecord()).toHaveProperty('timestamp');
  });

  it('passes symbol to user fee rate endpoint parameters when provided', async () => {
    const requestExecutorMock = {
      execute: jest.fn().mockResolvedValue({}),
    };
    const service = new AccountService(requestExecutorMock);

    await expect(service.getUserFeeRate(account, 'BTC-USDT')).resolves.toEqual(
      {},
    );

    const endpoint = requestExecutorMock.execute.mock.calls[0][0];
    expect(endpoint.parameters().asRecord()).toMatchObject({
      symbol: 'BTC-USDT',
    });
  });
});
