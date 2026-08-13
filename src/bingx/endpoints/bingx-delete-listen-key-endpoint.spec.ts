import { ApiAccount } from 'bingx-api/bingx/account/api-account';
import { BingxDeleteListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-delete-listen-key-endpoint';

describe('bingx delete listen key endpoint', () => {
  const account = new ApiAccount('api-key', 'secret-key');
  const endpoint = new BingxDeleteListenKeyEndpoint('listen-key', account);

  it('must describe delete listen key request', () => {
    expect(endpoint.method()).toBe('delete');
    expect(endpoint.path()).toBe('/openApi/user/auth/userDataStream');
    expect(endpoint.parameters().asRecord()).toMatchObject({
      listenKey: 'listen-key',
    });
  });

  it('must include signed endpoint details', () => {
    expect(endpoint.apiKey().asHeader()).toStrictEqual({
      'X-BX-APIKEY': 'api-key',
    });
    expect(endpoint.signature().toString()).toEqual(expect.any(String));
  });
});
