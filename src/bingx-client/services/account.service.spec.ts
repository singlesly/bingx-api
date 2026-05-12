import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { SignatureInterface } from 'bingx-api/bingx/account/signature.interface';
import { SignatureParametersInterface } from 'bingx-api/bingx/account/signature-parameters.interface';
import { BingxUserFeeRateEndpoint } from 'bingx-api/bingx/endpoints/bingx-user-fee-rate-endpoint';
import { RequestExecutorInterface } from 'bingx-api/bingx/request-executor/request-executor.interface';
import { AccountService } from 'bingx-api/bingx-client/services/account.service';

class TestAccount implements AccountInterface {
  getApiKey(): string {
    return 'test-api-key';
  }

  sign(parameters: SignatureParametersInterface): SignatureInterface {
    return {
      toString: () => JSON.stringify(parameters.asRecord()),
      secretKey: () => 'test-secret-key',
    };
  }
}

describe('AccountService', () => {
  let dateNowSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_714_000_000_000);
  });

  afterEach(() => {
    dateNowSpy.mockRestore();
  });

  it('describes the user fee rate endpoint request shape', () => {
    const endpoint = new BingxUserFeeRateEndpoint(new TestAccount(), 5000);

    expect(endpoint.method()).toBe('get');
    expect(endpoint.path()).toBe('/openApi/swap/v2/user/commissionRate');
    expect(endpoint.apiKey().asHeader()).toEqual({
      'X-BX-APIKEY': 'test-api-key',
    });
    expect(endpoint.parameters().asRecord()).toEqual({
      recvWindow: '5000',
      timestamp: '1714000000000',
    });
  });

  it('executes the user fee rate endpoint through account service', async () => {
    const account = new TestAccount();
    const requestExecutor: RequestExecutorInterface = {
      execute: jest.fn(async (endpoint) => endpoint as never),
    };
    const service = new AccountService(requestExecutor);

    const endpoint = await service.getUserFeeRate(account, 5000);

    expect(requestExecutor.execute).toHaveBeenCalledTimes(1);
    expect(endpoint).toBeInstanceOf(BingxUserFeeRateEndpoint);
    expect(
      (endpoint as unknown as BingxUserFeeRateEndpoint).parameters().asRecord(),
    ).toEqual({
      recvWindow: '5000',
      timestamp: '1714000000000',
    });
  });
});
