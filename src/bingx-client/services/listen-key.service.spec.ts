import { ApiAccount } from 'bingx-api/bingx/account/api-account';
import { BingxDeleteListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-delete-listen-key-endpoint';
import { BingxExtendListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-extend-listen-key-endpoint';
import { BingxGenerateListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-generate-listen-key-endpoint';
import { RequestExecutorInterface } from 'bingx-api/bingx/request-executor/request-executor.interface';
import { ListenKeyService } from 'bingx-api/bingx-client/services/listen-key.service';

describe('listen key service', () => {
  const account = new ApiAccount('api-key', 'secret-key');
  const listenKey = 'listen-key';
  let execute: jest.Mock;
  let service: ListenKeyService;

  beforeEach(() => {
    execute = jest.fn();
    service = new ListenKeyService({
      execute,
    } as unknown as RequestExecutorInterface);
  });

  it('generates listen keys', async () => {
    const response = { listenKey };
    execute.mockResolvedValueOnce(response);

    await expect(service.generateListenKey(account)).resolves.toBe(response);
    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith(
      expect.any(BingxGenerateListenKeyEndpoint),
    );
  });

  it('extends listen key validity periods', async () => {
    execute.mockResolvedValueOnce(undefined);

    await expect(service.extendListenKey(listenKey, account)).resolves.toBe(
      undefined,
    );
    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith(
      expect.any(BingxExtendListenKeyEndpoint),
    );
  });

  it('deletes listen keys', async () => {
    execute.mockResolvedValueOnce(undefined);

    await expect(service.deleteListenKey(listenKey, account)).resolves.toBe(
      undefined,
    );
    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith(
      expect.any(BingxDeleteListenKeyEndpoint),
    );
  });
});
