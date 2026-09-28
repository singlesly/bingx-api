import { createHmac } from 'crypto';
import { ApiAccount } from 'bingx-api/bingx/account/api-account';
import { BingxExtendListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-extend-listen-key-endpoint';
import { BingxExtendListenKeyEndpoint as PublicEndpoint } from 'bingx-api/index';

describe('extend listen key endpoint', () => {
  const timestamp = 1700000000000;
  const account = new ApiAccount('test-api-key', 'test-secret');
  const endpoint = new BingxExtendListenKeyEndpoint('test-listen-key', account);

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(timestamp);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('is exported through the public package entry point', () => {
    expect(PublicEndpoint).toBe(BingxExtendListenKeyEndpoint);
  });

  it('uses PUT on the user data stream endpoint', () => {
    expect(endpoint.method()).toBe('put');
    expect(endpoint.path()).toBe('/openApi/user/auth/userDataStream');
  });

  it('includes the requested listen key and timestamp', () => {
    expect(endpoint.parameters().asRecord()).toStrictEqual({
      listenKey: 'test-listen-key',
      timestamp: timestamp.toString(),
    });
  });

  it('uses the supplied account API key', () => {
    expect(endpoint.apiKey().asHeader()).toStrictEqual({
      'X-BX-APIKEY': 'test-api-key',
    });
  });

  it('signs the listen key and timestamp with the supplied account', () => {
    const signature = createHmac('sha256', 'test-secret')
      .update(`listenKey=test-listen-key&timestamp=${timestamp}`)
      .digest('hex');

    expect(endpoint.signature().toString()).toBe(signature);
  });
});
