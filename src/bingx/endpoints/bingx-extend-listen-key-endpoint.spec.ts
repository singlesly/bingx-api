import { ApiAccount } from 'bingx-api/bingx/account/api-account';
import { BingxExtendListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-extend-listen-key-endpoint';

describe('BingxExtendListenKeyEndpoint', () => {
  const endpoint = new BingxExtendListenKeyEndpoint(
    'listen-key-123',
    new ApiAccount('api-key', 'secret-key'),
  );

  it('describes the extend listen key endpoint', () => {
    expect(endpoint.method()).toBe('put');
    expect(endpoint.path()).toBe('/openApi/user/auth/userDataStream');
  });

  it('passes listen key as a signed parameter', () => {
    expect(endpoint.parameters().asRecord()).toEqual(
      expect.objectContaining({
        listenKey: 'listen-key-123',
      }),
    );
  });
});
