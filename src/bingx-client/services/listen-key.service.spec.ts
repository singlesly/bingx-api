import { ApiAccount } from 'bingx-api/bingx/account/api-account';
import { BingxDeleteListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-delete-listen-key-endpoint';
import { BingxGenerateListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-generate-listen-key-endpoint';
import { RequestExecutorInterface } from 'bingx-api/bingx/request-executor/request-executor.interface';
import { ListenKeyService } from 'bingx-api/bingx-client/services/listen-key.service';

describe('listen key service', () => {
  const account = new ApiAccount('api-key', 'secret-key');
  let requestExecutor: jest.Mocked<RequestExecutorInterface>;
  let service: ListenKeyService;

  beforeEach(() => {
    requestExecutor = {
      execute: jest.fn(),
    };
    service = new ListenKeyService(requestExecutor);
  });

  it('must generate listen key', async () => {
    requestExecutor.execute.mockResolvedValueOnce({ listenKey: 'listen-key' });

    await expect(service.generateListenKey(account)).resolves.toStrictEqual({
      listenKey: 'listen-key',
    });
    expect(requestExecutor.execute).toHaveBeenCalledWith(
      expect.any(BingxGenerateListenKeyEndpoint),
    );
  });

  it('must delete listen key', async () => {
    requestExecutor.execute.mockResolvedValueOnce(undefined);

    await expect(
      service.deleteListenKey('listen-key', account),
    ).resolves.toBeUndefined();
    expect(requestExecutor.execute).toHaveBeenCalledWith(
      expect.any(BingxDeleteListenKeyEndpoint),
    );
  });
});
