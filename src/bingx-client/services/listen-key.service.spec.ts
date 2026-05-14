import { ApiAccount } from 'bingx-api/bingx/account/api-account';
import { BingxDeleteListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-delete-listen-key-endpoint';
import { BingxExtendListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-extend-listen-key-endpoint';
import { BingxGenerateListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-generate-listen-key-endpoint';
import { ListenKeyService } from 'bingx-api/bingx-client/services/listen-key.service';

describe('ListenKeyService', () => {
  const account = new ApiAccount('api-key', 'secret-key');

  it('executes generate listen key endpoint', async () => {
    const requestExecutorMock = {
      execute: jest.fn().mockResolvedValue({ listenKey: 'listen-key-123' }),
    };
    const service = new ListenKeyService(requestExecutorMock);

    await expect(service.generateListenKey(account)).resolves.toEqual({
      listenKey: 'listen-key-123',
    });

    expect(requestExecutorMock.execute).toHaveBeenCalledWith(
      expect.any(BingxGenerateListenKeyEndpoint),
    );
  });

  it('executes extend listen key endpoint', async () => {
    const requestExecutorMock = {
      execute: jest.fn().mockResolvedValue(undefined),
    };
    const service = new ListenKeyService(requestExecutorMock);

    await expect(
      service.extendListenKey('listen-key-123', account),
    ).resolves.toBeUndefined();

    expect(requestExecutorMock.execute).toHaveBeenCalledWith(
      expect.any(BingxExtendListenKeyEndpoint),
    );
  });

  it('executes delete listen key endpoint', async () => {
    const requestExecutorMock = {
      execute: jest.fn().mockResolvedValue(undefined),
    };
    const service = new ListenKeyService(requestExecutorMock);

    await expect(
      service.deleteListenKey('listen-key-123', account),
    ).resolves.toBeUndefined();

    expect(requestExecutorMock.execute).toHaveBeenCalledWith(
      expect.any(BingxDeleteListenKeyEndpoint),
    );
  });
});
