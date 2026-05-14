import { ApiAccount } from 'bingx-api/bingx/account/api-account';
import { BingxDeleteListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-delete-listen-key-endpoint';

describe('BingxDeleteListenKeyEndpoint', () => {
  const endpoint = new BingxDeleteListenKeyEndpoint(
    'listen-key-123',
    new ApiAccount('api-key', 'secret-key'),
  );

  it('describes the delete listen key endpoint', () => {
    expect(endpoint.method()).toBe('delete');
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
