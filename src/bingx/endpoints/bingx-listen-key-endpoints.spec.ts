import { ApiAccount } from 'bingx-api/bingx/account/api-account';
import { BingxDeleteListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-delete-listen-key-endpoint';
import { BingxExtendListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-extend-listen-key-endpoint';
import { BingxGenerateListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-generate-listen-key-endpoint';

describe('listen key endpoints', () => {
  const account = new ApiAccount('api-key', 'secret-key');
  const listenKey = 'listen-key';

  it('generates listen keys', () => {
    const endpoint = new BingxGenerateListenKeyEndpoint(account);
    const parameters = endpoint.parameters().asRecord();

    expect(endpoint.method()).toBe('post');
    expect(endpoint.path()).toBe('/openApi/user/auth/userDataStream');
    expect(Object.keys(parameters)).toEqual(['timestamp']);
    expect(Number(parameters.timestamp)).not.toBeNaN();
  });

  it('extends listen key validity periods', () => {
    const endpoint = new BingxExtendListenKeyEndpoint(listenKey, account);
    const parameters = endpoint.parameters().asRecord();

    expect(endpoint.method()).toBe('put');
    expect(endpoint.path()).toBe('/openApi/user/auth/userDataStream');
    expect(parameters).toMatchObject({ listenKey });
    expect(Object.keys(parameters).sort()).toEqual(['listenKey', 'timestamp']);
    expect(Number(parameters.timestamp)).not.toBeNaN();
  });

  it('deletes listen keys', () => {
    const endpoint = new BingxDeleteListenKeyEndpoint(listenKey, account);
    const parameters = endpoint.parameters().asRecord();

    expect(endpoint.method()).toBe('delete');
    expect(endpoint.path()).toBe('/openApi/user/auth/userDataStream');
    expect(parameters).toMatchObject({ listenKey });
    expect(Object.keys(parameters).sort()).toEqual(['listenKey', 'timestamp']);
    expect(Number(parameters.timestamp)).not.toBeNaN();
  });
});
