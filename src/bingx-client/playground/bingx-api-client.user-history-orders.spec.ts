import { BingxApiClient } from 'bingx-api/bingx-client';
import {
  ApiAccount,
  BingxResponse,
  HttpRequestExecutor,
} from 'bingx-api/bingx';
import { subDays } from 'date-fns';
import { EnvProviderService } from '@ledius/env';
import { BingxUserHistoryOrdersResponse } from 'bingx-api/bingx/endpoints/bingx-user-history-orders-response';

describe.skip('bingx api client user history orders', () => {
  const env = new EnvProviderService();

  const account = new ApiAccount(
    env.getOrFail('API_ACCOUNT_KEY'),
    env.getOrFail('API_ACCOUNT_SECRET'),
  );

  let client: BingxApiClient;

  beforeAll(() => {
    client = new BingxApiClient(new HttpRequestExecutor());
  });

  describe('get history orders', () => {
    let response: BingxResponse<BingxUserHistoryOrdersResponse>;
    beforeAll(async () => {
      response = await client
        .getTradeService()
        .getUserHistoryOrders(
          'BTC-USDT',
          50,
          subDays(new Date(), 1),
          new Date(),
          account,
        );
    });

    it('must be got response', () => {
      expect(response).toStrictEqual({});
    });
  });
});
