import { ApiAccount } from 'bingx-api/bingx/account/api-account';
import { BingxDeleteListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-delete-listen-key-endpoint';

describe('bingx delete listen key endpoint', () => {
  const account = new ApiAccount('api-key', 'secret-key');
  const endpoint = new BingxDeleteListenKeyEndpoint('listen-key', account);

  it('uses the delete HTTP method', () => {
    expect(endpoint.method()).toBe('delete');
  });

  it('uses the user data stream path', () => {
    expect(endpoint.path()).toBe('/openApi/user/auth/userDataStream');
  });

  it('includes the listen key in signed parameters', () => {
    expect(endpoint.parameters().asRecord()).toMatchObject({
      listenKey: 'listen-key',
    });
  });
});
