import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import {
  BingxExportFundFlowEndpoint,
  BingxExportFundFlowResponse,
} from 'bingx-api/bingx/endpoints/bingx-export-fund-flow-endpoint';
import { RequestExecutorInterface } from 'bingx-api/bingx/request-executor/request-executor.interface';
import { AccountService } from 'bingx-api/bingx-client/services/account.service';

class TestRequestExecutor implements RequestExecutorInterface {
  public endpoint?: EndpointInterface;

  execute<T>(endpoint: EndpointInterface<T>): Promise<T> {
    this.endpoint = endpoint;
    return Promise.resolve({} as T);
  }
}

const account: AccountInterface = {
  getApiKey: () => 'api-key',
  sign: () => ({
    toString: () => 'signature',
    secretKey: () => 'secret-key',
  }),
};

describe('AccountService', () => {
  describe('exportFundFlow', () => {
    it('dispatches the export fund flow endpoint', async () => {
      const executor = new TestRequestExecutor();
      const service = new AccountService(executor);

      await service.exportFundFlow(
        {
          symbol: 'BTC-USDT',
          incomeType: 'REALIZED_PNL',
          startTime: new Date('2026-05-01T00:00:00.000Z'),
          endTime: 1777680000000,
          limit: 200,
          recvWindow: 5000,
        },
        account,
      );

      const endpoint = executor.endpoint as BingxExportFundFlowEndpoint;
      const parameters = endpoint.parameters().asRecord();

      expect(endpoint).toBeInstanceOf(BingxExportFundFlowEndpoint);
      expect(endpoint.method()).toBe('get');
      expect(endpoint.path()).toBe('/openApi/swap/v2/user/income/export');
      expect(endpoint.responseType()).toBe('arraybuffer');
      expect(parameters).toMatchObject({
        symbol: 'BTC-USDT',
        incomeType: 'REALIZED_PNL',
        startTime: '1777593600000',
        endTime: '1777680000000',
        limit: '200',
        recvWindow: '5000',
      });
      expect(parameters.timestamp).toBeDefined();
    });

    it('omits optional export filters when they are not provided', async () => {
      const endpoint =
        new BingxExportFundFlowEndpoint<BingxExportFundFlowResponse>(
          {},
          account,
        );

      expect(Object.keys(endpoint.parameters().asRecord())).toEqual([
        'timestamp',
      ]);
    });
  });
});
