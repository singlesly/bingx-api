import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { BingxListenKeyService } from '@app/bingx/services/bingx-listen-key.service';
import { BingxWebsocketClient } from '@app/bingx/websocket/bingx-websocket.client';
import axiosThrottle from 'axios-request-throttle';
import { BingxMarketWebsocketClient } from '@app/bingx/websocket/bingx-market-websocket.client';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        baseURL: 'https://open-api.bingx.com',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    }),
  ],
  providers: [
    BingxListenKeyService,
    BingxWebsocketClient,
    BingxMarketWebsocketClient,
  ],
  exports: [
    BingxListenKeyService,
    BingxWebsocketClient,
    BingxMarketWebsocketClient,
  ],
})
export class BingXModule {
  constructor(private readonly http: HttpService) {
    axiosThrottle.use(this.http.axiosRef, {
      requestsPerSecond: 4,
    });
  }
}
