import { DynamicModule, Module } from '@nestjs/common';
import { BingxApiClient } from 'bingx-api/bingx-client';
import { HttpRequestExecutor, RequestExecutorInterface } from 'bingx-api/bingx';
import { NestBingxConfigurationInterface } from 'bingx-api/nest-bingx/nest-bingx-configuration.interface';

@Module({
  providers: [
    HttpRequestExecutor,
    {
      provide: BingxApiClient,
      inject: [HttpRequestExecutor],
      useFactory: (httpRequestExecutor: HttpRequestExecutor) =>
        new BingxApiClient(httpRequestExecutor),
    },
  ],
  exports: [BingxApiClient],
})
export class NestBingxModule {
  public static configure(
    configuration: NestBingxConfigurationInterface,
  ): DynamicModule {
    const {
      requestExecutor = HttpRequestExecutor,
      providers = [],
      imports = [],
    } = configuration;

    const injectionToken = 'CUSTOM_REQUEST_EXECUTOR';

    return {
      module: NestBingxModule,
      imports,
      providers: [
        ...providers,
        {
          useClass: requestExecutor,
          provide: injectionToken,
        },
        {
          provide: BingxApiClient,
          inject: [injectionToken],
          useFactory: (requestExecutor: RequestExecutorInterface) =>
            new BingxApiClient(requestExecutor),
        },
      ],
      exports: [BingxApiClient],
    };
  }
}
