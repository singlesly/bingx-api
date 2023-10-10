import { Subject } from 'rxjs';
import { AccountInterface } from '@app/bingx/account/account.interface';
import {
  BingxGenerateListenKeyEndpoint,
  HttpRequestExecutor,
  RequestExecutorInterface,
} from '@app/bingx';
import zlib from 'zlib';
import { webSocket } from 'rxjs/webSocket';
import { BingxWebsocketDeserializer } from '@app/bingx-socket/bingx-websocket-deserializer';
import { BingxWebsocketSerializer } from '@app/bingx-socket/bingx-websocket-serializer';

export class BingxAccountSocketStream {
  public readonly onConnect$ = new Subject();
  public readonly onDisconnect$ = new Subject();
  public readonly heartbeat$ = new Subject();

  constructor(
    private readonly account: AccountInterface,
    private readonly requestExecutor: RequestExecutorInterface = new HttpRequestExecutor(),
  ) {
    this.connect(account, requestExecutor);
  }

  private async connect(
    account: AccountInterface,
    requestExecutor: RequestExecutorInterface,
  ) {
    const {
      data: { listenKey },
    } = await requestExecutor.execute(
      new BingxGenerateListenKeyEndpoint(account),
    );

    const url = new URL('/swap-market', 'wss://open-api-swap.bingx.com');
    url.searchParams.set('listenKey', listenKey);
    webSocket({
      ...new BingxWebsocketDeserializer(),
      ...new BingxWebsocketSerializer(),
      url: url.toString(),
      WebSocketCtor: WebSocket,
      openObserver: this.onConnect$,
      closeObserver: this.onDisconnect$,
    });
  }
}
