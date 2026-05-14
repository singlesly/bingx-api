import { ApiAccount } from 'bingx-api/bingx/account/api-account';
import { BingxQueryOrderEndpoint } from 'bingx-api/bingx/endpoints/bingx-query-order-endpoint';
import { TradeService } from 'bingx-api/bingx-client/services/trade.service';

describe('TradeService', () => {
  const account = new ApiAccount('api-key', 'secret-key');

  it('executes query order endpoint', async () => {
    const requestExecutorMock = {
      execute: jest.fn().mockResolvedValue({}),
    };
    const service = new TradeService(requestExecutorMock);

    await expect(
      service.queryOrder(
        {
          orderId: '123456789',
          symbol: 'BTC-USDT',
        },
        account,
      ),
    ).resolves.toEqual({});

    expect(requestExecutorMock.execute).toHaveBeenCalledWith(
      expect.any(BingxQueryOrderEndpoint),
    );
  });
});
