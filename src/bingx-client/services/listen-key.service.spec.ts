import { ApiAccount } from 'bingx-api/bingx';
import { BingxDeleteListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-delete-listen-key-endpoint';
import { BingxExtendListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-extend-listen-key-endpoint';
import { BingxGenerateListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-generate-listen-key-endpoint';
import { RequestExecutorInterface } from 'bingx-api/bingx/request-executor/request-executor.interface';
import { ListenKeyService } from './listen-key.service';

describe('listen key service', () => {
  let execute: jest.Mock;
  let service: ListenKeyService;
  const account = new ApiAccount('api-key', 'secret-key');

  beforeEach(() => {
    execute = jest.fn().mockResolvedValue(undefined);
    service = new ListenKeyService({
      execute,
    } as RequestExecutorInterface);
  });

  it('must execute generate listen key endpoint', async () => {
    await service.generateListenKey(account);

    expect(execute).toHaveBeenCalledWith(
      expect.any(BingxGenerateListenKeyEndpoint),
    );
  });

  it('must execute extend listen key validity period endpoint', async () => {
    await service.extendListenKeyValidityPeriod('listen-key', account);

    expect(execute).toHaveBeenCalledWith(
      expect.any(BingxExtendListenKeyEndpoint),
    );

    const endpoint = execute.mock.calls[0][0] as BingxExtendListenKeyEndpoint;
    expect(endpoint.method()).toBe('put');
    expect(endpoint.path()).toBe('/openApi/user/auth/userDataStream');
    expect(endpoint.parameters().asRecord()).toEqual(
      expect.objectContaining({
        listenKey: 'listen-key',
      }),
    );
  });

  it('must execute delete listen key endpoint', async () => {
    await service.deleteListenKey('listen-key', account);

    expect(execute).toHaveBeenCalledWith(
      expect.any(BingxDeleteListenKeyEndpoint),
    );

    const endpoint = execute.mock.calls[0][0] as BingxDeleteListenKeyEndpoint;
    expect(endpoint.method()).toBe('delete');
    expect(endpoint.path()).toBe('/openApi/user/auth/userDataStream');
    expect(endpoint.parameters().asRecord()).toEqual(
      expect.objectContaining({
        listenKey: 'listen-key',
      }),
    );
  });
});
