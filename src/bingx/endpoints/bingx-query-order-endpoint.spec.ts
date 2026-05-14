import { ApiAccount } from 'bingx-api/bingx/account/api-account';
import { BingxQueryOrderEndpoint } from 'bingx-api/bingx/endpoints/bingx-query-order-endpoint';

describe('BingxQueryOrderEndpoint', () => {
  const endpoint = new BingxQueryOrderEndpoint(
    {
      orderId: '123456789',
      symbol: 'BTC-USDT',
    },
    new ApiAccount('api-key', 'secret-key'),
  );

  it('describes the query order endpoint', () => {
    expect(endpoint.method()).toBe('get');
    expect(endpoint.path()).toBe('/openApi/swap/v2/trade/order');
  });

  it('passes order id and symbol as signed parameters', () => {
    expect(endpoint.parameters().asRecord()).toEqual(
      expect.objectContaining({
        orderId: '123456789',
        symbol: 'BTC-USDT',
      }),
    );
  });
});
