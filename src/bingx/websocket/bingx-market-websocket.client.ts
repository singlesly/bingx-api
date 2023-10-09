import { Injectable } from '@nestjs/common';
import { filter, fromEvent, map, Observable, Subject, tap } from 'rxjs';
import * as WebSocket from 'ws';
import * as zlib from 'zlib';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable()
export class BingxMarketWebsocketClient {
  public readonly price$: Subject<Record<string, number>> = new Subject<
    Record<string, number>
  >();
  private readonly symbols: string[] = [];
  private client: WebSocketSubject<any>;

  constructor() {
    this.connect();
  }

  public getPriceForSymbol$(symbol: string): Observable<number> {
    return this.price$.pipe(
      map((prices) => prices[symbol]),
      filter((price) => typeof price === 'number'),
    );
  }

  public connect(): void {
    const url = new URL('/swap-market', 'wss://open-api-swap.bingx.com');
    const onOpen$ = new Subject<Event>();
    const onClose$ = new Subject<Event>();
    this.client = webSocket({
      deserializer: (event: MessageEvent) => {
        const message = zlib.unzipSync(event.data).toString('utf-8');

        try {
          return JSON.parse(message);
        } catch (e) {
          return message;
        }
      },
      serializer: (e) => {
        if (typeof e === 'string') {
          return e;
        }

        return JSON.stringify(e);
      },
      url: url.toString(),
      WebSocketCtor: WebSocket,
      openObserver: onOpen$,
      closeObserver: onClose$,
    });

    onOpen$
      .pipe(
        tap(() => console.log(`connected to market data`)),
        tap(() => {
          this.symbols.forEach((symbol) => this.listen(symbol));
        }),
      )
      .subscribe();

    this.client.subscribe({
      next: async (message: 'Ping' | Record<string, unknown>) => {
        if (message === 'Ping') {
          this.client.next('Pong');
          return;
        }

        await this.handleMessage(message);
      },
      error: (err: any) => {
        console.log('websocket got error', err);
      },
    });

    onClose$.subscribe(() => {
      onOpen$.unsubscribe();
      onClose$.unsubscribe();
      this.client.unsubscribe();
      this.client.complete();
      this.connect();
      this.symbols.forEach((symbol) => this.listen(symbol));
    });
  }

  public listen(symbol: string): void {
    console.log('lister for price', symbol);
    this.client.next({
      id: `listen-price-for-${symbol}`,
      reqType: 'sub',
      dataType: `${symbol}@depth5`,
    });
    this.symbols.push(symbol);
  }

  public async handleMessage(message: Record<string, any>): Promise<void> {
    const { dataType, data } = message;

    if (!data) {
      return;
    }

    const symbol = dataType.split('@')[0];
    if (this.symbols.includes(symbol)) {
      const { bids, asks } = data;
      const price = ((Number(bids[0][0]) + Number(asks[0][0])) / 2).toFixed(1);

      this.price$.next({ [symbol]: Number(price) });
      return;
    }

    console.log('unhandled message', message);
  }
}
