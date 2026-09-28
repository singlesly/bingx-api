import { ApiAccount } from 'bingx-api/bingx/account/api-account';
import { BingxExtendListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-extend-listen-key-endpoint';
import { BingxGenerateListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-generate-listen-key-endpoint';
import { ListenKeyService } from './listen-key.service';

describe('listen key service', () => {
  const account = new ApiAccount('test-api-key', 'test-secret');
  let execute: jest.Mock;
  let service: ListenKeyService;

  beforeEach(() => {
    execute = jest.fn();
    service = new ListenKeyService({ execute });
  });

  it('extends the requested key using the supplied account', async () => {
    execute.mockResolvedValueOnce(undefined);

    await expect(
      service.extendListenKey('test-listen-key', account),
    ).resolves.toBeUndefined();

    expect(execute).toHaveBeenCalledTimes(1);
    const endpoint = execute.mock.calls[0][0];
    expect(endpoint).toBeInstanceOf(BingxExtendListenKeyEndpoint);
    expect(endpoint.parameters().asRecord()).toMatchObject({
      listenKey: 'test-listen-key',
    });
    expect(endpoint.apiKey().asHeader()).toStrictEqual({
      'X-BX-APIKEY': 'test-api-key',
    });
  });

  it('waits for the executor to finish the renewal', async () => {
    let finish: () => void = () => undefined;
    execute.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
    );
    const completed = jest.fn();
    const renewal = service.extendListenKey('test-listen-key', account);
    void renewal.then(completed);

    await Promise.resolve();
    expect(completed).not.toHaveBeenCalled();

    finish();
    await renewal;
    expect(completed).toHaveBeenCalledTimes(1);
  });

  it('propagates executor failures to the caller', async () => {
    const failure = new Error('Listen key renewal failed');
    execute.mockRejectedValueOnce(failure);

    await expect(
      service.extendListenKey('test-listen-key', account),
    ).rejects.toBe(failure);
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it('preserves listen key generation and its response', async () => {
    const response = { listenKey: 'new-listen-key' };
    execute.mockResolvedValueOnce(response);

    await expect(service.generateListenKey(account)).resolves.toBe(response);
    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute.mock.calls[0][0]).toBeInstanceOf(
      BingxGenerateListenKeyEndpoint,
    );
  });
});
