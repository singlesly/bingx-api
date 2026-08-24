import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { BingxDeleteListenKeyEndpoint } from 'bingx-api/bingx/endpoints/bingx-delete-listen-key-endpoint';
import { ListenKeyService } from 'bingx-api/bingx-client/services/listen-key.service';
import { RequestExecutorInterface } from 'bingx-api/bingx/request-executor/request-executor.interface';

describe('listen key service', () => {
  const account = {} as AccountInterface;
  let execute: jest.Mock;
  let service: ListenKeyService;

  beforeEach(() => {
    execute = jest.fn().mockResolvedValue(undefined);
    service = new ListenKeyService({ execute } as RequestExecutorInterface);
  });

  it('deletes a listen key using the delete listen key endpoint', async () => {
    await service.deleteListenKey('listen-key', account);

    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute.mock.calls[0][0]).toBeInstanceOf(BingxDeleteListenKeyEndpoint);
  });
});
