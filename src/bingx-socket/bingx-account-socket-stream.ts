import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { AccountInterface } from 'bingx-api/bingx/account/account.interface';
import {
  BingxGenerateListenKeyEndpoint,
  HttpRequestExecutor,
  pong,
  RequestExecutorInterface,
} from 'bingx-api/bingx';
import { webSocket } from 'rxjs/webSocket';
import { BingxWebsocketDeserializer } from 'bingx-api/bingx-socket/bingx-websocket-deserializer';
import { BingxWebsocketSerializer } from 'bingx-api/bingx-socket/bingx-websocket-serializer';
import { HeartbeatInterface } from 'bingx-api/bingx-socket/interfaces/heartbeat.interface';
import { filterAndEmitToSubject } from 'bingx-api/bingx-socket/operators/filter-and-emit-to-subject';
import {
  AccountBalanceAndPositionPushEvent,
  AccountOrderUpdatePushEvent,
  AccountWebSocketEvent,
  AccountWebsocketEventType,
  ListenKeyExpiredEvent,
} from 'bingx-api/bingx-socket/events/account-websocket-events';
import * as WebSocket from 'ws';

export interface BingxAccountSocketStreamConfiguration {
  requestExecutor?: RequestExecutorInterface;
  url?: URL;
}

export class BingxAccountSocketStream {
  private forceClose$ = new BehaviorSubject<boolean>(false);
  private readonly configuration: Required<BingxAccountSocketStreamConfiguration>;
  public readonly onConnect$ = new Subject();
  public readonly onDisconnect$ = new Subject<CloseEvent>();
  public readonly heartbeat$ = new ReplaySubject<HeartbeatInterface>(1);
  public readonly listenKeyExpired$ = new Subject<ListenKeyExpiredEvent>();
  public readonly accountBalanceAndPositionPush$ =
    new Subject<AccountBalanceAndPositionPushEvent>();
  public readonly accountOrderUpdatePushEvent$ =
    new Subject<AccountOrderUpdatePushEvent>();

  constructor(
    private readonly account: AccountInterface,
    configuration: BingxAccountSocketStreamConfiguration = {},
  ) {
    this.configuration = {
      requestExecutor:
        configuration.requestExecutor ?? new HttpRequestExecutor(),
      url:
        configuration.url ??
        new URL('/swap-market', 'wss://open-api-swap.bingx.com'),
    };

    try {
      this.connect(this.account, this.configuration.requestExecutor).catch(
        () => {
          console.error('Cannot connect to account', this.account);
        },
      );
    } catch (e) {
      console.error('Cannot connect to account error', this.account);
    }
  }

  private async connect(
    account: AccountInterface,
    requestExecutor: RequestExecutorInterface,
  ): Promise<void> {
    const responseKey = await requestExecutor.execute(
      new BingxGenerateListenKeyEndpoint(account),
    );

    const url = this.configuration.url;
    url.searchParams.set('listenKey', responseKey.listenKey);

    const socket$ = webSocket<AccountWebSocketEvent>({
      deserializer: (e) => new BingxWebsocketDeserializer().deserializer(e),
      serializer: (e) => new BingxWebsocketSerializer().serializer(e),
      url: url.toString(),
      WebSocketCtor: WebSocket as never,
      openObserver: this.onConnect$,
      closeObserver: this.onDisconnect$,
    });

    const socketSubscription = socket$
      .pipe(
        pong(socket$, this.heartbeat$),
        filterAndEmitToSubject(
          (event): event is ListenKeyExpiredEvent =>
            event.e === AccountWebsocketEventType.LISTEN_KEY_EXPIRED,
          this.listenKeyExpired$,
        ),
        filterAndEmitToSubject(
          (event): event is AccountBalanceAndPositionPushEvent =>
            event.e === AccountWebsocketEventType.ACCOUNT_UPDATE,
          this.accountBalanceAndPositionPush$,
        ),
        filterAndEmitToSubject(
          (event): event is AccountOrderUpdatePushEvent =>
            event.e === AccountWebsocketEventType.ORDER_TRADE_UPDATE,
          this.accountOrderUpdatePushEvent$,
        ),
      )
      .subscribe();

    this.onDisconnect$.subscribe(() => {
      socketSubscription.unsubscribe();
      console.log(
        `${BingxAccountSocketStream.name} disconnected ${account.getApiKey()}`,
      );
    });

    this.forceClose$.subscribe((v) => {
      if (v) {
        socket$.complete();
      }
    });
  }

  public disconnect() {
    this.forceClose$.next(true);
  }
}
