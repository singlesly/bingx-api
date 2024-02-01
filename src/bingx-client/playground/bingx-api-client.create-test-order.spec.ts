import { EnvProviderService } from '@ledius/env';
import {
  ApiAccount,
  HttpRequestExecutor,
  OrderPositionSideEnum,
  OrderSideEnum,
  OrderTypeEnum,
} from 'bingx-api/bingx';
import { BingxApiClient } from 'bingx-api/bingx-client';

describe('create test order', () => {
  const env = new EnvProviderService();

  const account = new ApiAccount(
    env.getOrFail('API_ACCOUNT_KEY'),
    env.getOrFail('API_ACCOUNT_SECRET'),
  );

  let client: BingxApiClient;

  beforeAll(() => {
    client = new BingxApiClient(new HttpRequestExecutor());
  });

  describe('create test order', () => {
    it('should be create order', async () => {
      const response = await client.getTradeService().createTradeOrderTest(
        {
          clientOrderID: '',
          side: OrderSideEnum.BUY,
          positionSide: OrderPositionSideEnum.LONG,
          price: '30000',
          quantity: '0.001',
          symbol: 'BTC-USDT',
          type: OrderTypeEnum.MARKET,
        },
        account,
      );

      expect(response).toStrictEqual({});
    });
  });
});
