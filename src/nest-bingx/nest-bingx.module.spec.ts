import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpRequestExecutor,
  NestBingxModule,
  RequestExecutorInterface,
} from 'bingx-api/index';
import { BingxApiClient } from 'bingx-api/index';

describe('nest bingx module', () => {
  describe('with default http request executor', () => {
    let module: TestingModule;
    let client: BingxApiClient;

    beforeEach(async () => {
      module = await Test.createTestingModule({
        imports: [NestBingxModule],
      }).compile();

      client = module.get(BingxApiClient);
    });

    it('api client initialized', () => {
      expect(client).toBeInstanceOf(BingxApiClient);
    });

    it('default http executor detect', () => {
      expect(client['requestExecutor']).toBeInstanceOf(HttpRequestExecutor);
    });
  });

  describe('with default http request executor when configure', () => {
    let module: TestingModule;
    let client: BingxApiClient;

    beforeEach(async () => {
      module = await Test.createTestingModule({
        imports: [NestBingxModule.configure({})],
      }).compile();

      client = module.get(BingxApiClient);
    });

    it('api client initialized', () => {
      expect(client).toBeInstanceOf(BingxApiClient);
    });

    it('default http executor detect', () => {
      expect(client['requestExecutor']).toBeInstanceOf(HttpRequestExecutor);
    });
  });

  describe('with custom http executor when configure', () => {
    let module: TestingModule;
    let client: BingxApiClient;

    class TestExecutor implements RequestExecutorInterface {
      async execute<T>(): Promise<T> {
        return {} as never;
      }
    }

    beforeEach(async () => {
      module = await Test.createTestingModule({
        imports: [
          NestBingxModule.configure({
            requestExecutor: TestExecutor,
          }),
        ],
      }).compile();

      client = module.get(BingxApiClient);
    });

    it('api client initialized', () => {
      expect(client).toBeInstanceOf(BingxApiClient);
    });

    it('default http provider detect', () => {
      expect(client['requestExecutor']).toBeInstanceOf(TestExecutor);
    });
  });
});
