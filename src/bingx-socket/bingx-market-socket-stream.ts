import { pong } from 'bingx-api/bingx';
import { webSocket } from 'rxjs/webSocket';
import { BingxWebsocketDeserializer } from 'bingx-api/bingx-socket/bingx-websocket-deserializer';
import { BingxWebsocketSerializer } from 'bingx-api/bingx-socket/bingx-websocket-serializer';
import * as WebSocket from 'ws';
import { filterAndEmitToSubject } from 'bingx-api/bingx-socket/operators/filter-and-emit-to-subject';
import {
  BehaviorSubject,
  distinct,
  ReplaySubject,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { HeartbeatInterface } from 'bingx-api/bingx-socket/interfaces/heartbeat.interface';
import {
  LatestTradeEvent,
  MarkerSubscription,
  MarketWebsocketEvents,
  SubscriptionType,
} from 'bingx-api/bingx-socket/events/market-websocket-events';

export class BingxMarketSocketStream {
  private forceClose$ = new BehaviorSubject<boolean>(false);
  private readonly dataTypes$ = new ReplaySubject<SubscriptionType>();

  private readonly onConnect$ = new Subject();
  public readonly onDisconnect$ = new Subject<CloseEvent>();
  public readonly heartbeat$ = new ReplaySubject<HeartbeatInterface>(1);
  public readonly latestTradeDetail$ = new Subject<LatestTradeEvent>();

  constructor(
    url: URL = new URL('/swap-market', 'wss://open-api-swap.bingx.com'),
  ) {
    this.connect(url);
  }

  private async connect(url: URL): Promise<void> {
    const socket$ = webSocket<MarketWebsocketEvents | MarkerSubscription>({
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
          (event): event is LatestTradeEvent =>
            event.dataType.includes('trade'),
          this.latestTradeDetail$,
        ),
      )
      .subscribe();

    this.onConnect$
      .pipe(
        switchMap(() => this.dataTypes$),
        distinct(),
        tap((dataType) =>
          socket$.next({
            id: `listen-for-${dataType}`,
            reqType: 'sub',
            dataType,
          }),
        ),
      )
      .subscribe();

    this.onDisconnect$.subscribe(() => {
      socketSubscription.unsubscribe();

      if (!this.forceClose$.value) {
        this.connect(url);
      }
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

  public subscribe(dataType: SubscriptionType) {
    this.dataTypes$.next(dataType);
  }
}
