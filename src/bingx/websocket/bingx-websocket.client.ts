import { Injectable } from '@nestjs/common';
import { AccountInterface } from '@app/bingx/account/account.interface';
import * as WebSocket from 'ws';
import { BingxListenKeyService } from '@app/bingx-client/services/bingx-listen-key.service';
import * as zlib from 'zlib';
import { share, Subject } from 'rxjs';
import { WebsocketEvent } from '@app/bingx/interfaces/websocket-event';

@Injectable()
export class BingxWebsocketClient {
  private readonly listeners = new Map<string, [AccountInterface, WebSocket]>();
  private readonly event$: Subject<{
    event: WebsocketEvent;
    account: AccountInterface;
  }> = new Subject<{
    event: WebsocketEvent;
    account: AccountInterface;
  }>();
  public readonly ping$ = new Subject<AccountInterface>();

  constructor(private readonly bingxListenKeyService: BingxListenKeyService) {}

  public getEvent$() {
    return this.event$.pipe(share());
  }

  public async connect(account: AccountInterface): Promise<void> {
    if (this.listeners.has(account.getApiKey())) {
      return;
    }

    const { listenKey } =
      await this.bingxListenKeyService.generateListenKey(account);
    const url = new URL('/swap-market', 'wss://open-api-swap.bingx.com');
    url.searchParams.set('listenKey', listenKey);

    const client = new WebSocket(url.toString());

    client.on('open', () => {
      console.log(
        `connected account/listenKey`,
        account.getApiKey(),
        listenKey,
      );

      this.listeners.set(account.getApiKey(), [account, client]);
    });

    client.on('message', async (buff: Buffer) => {
      const message = zlib.unzipSync(buff).toString('utf-8');
      if (message === 'Ping') {
        client.send('Pong');
        this.ping$.next(account);
        return;
      }

      const parsedMessage: WebsocketEvent = JSON.parse(message);

      await this.handleMessage(account, parsedMessage);
    });

    client.on('close', async () => {
      await this.handleClose(account);
    });
  }

  public async handleMessage(
    account: AccountInterface,
    message: WebsocketEvent,
  ): Promise<void> {
    const { e: event } = message;

    if (event === 'listenKeyExpired') {
      console.log('reconnect for new listen key');
      await this.interrupt(account);
      return;
    }

    if (event === 'ORDER_TRADE_UPDATE' || event === 'ACCOUNT_UPDATE') {
      this.event$.next({
        account,
        event: message,
      });

      return;
    }
  }

  public async handleClose(account: AccountInterface): Promise<void> {
    this.listeners.delete(account.getApiKey());
    await this.connect(account);
  }

  public async interrupt(account: AccountInterface): Promise<void> {
    setTimeout(() => {
      const listener = this.listeners.get(account.getApiKey());
      if (!listener) {
        return;
      }

      const [, client] = listener;

      console.log('interrupt connection for', account.getApiKey());

      this.listeners.delete(account.getApiKey());
      client.removeAllListeners('close');
      client.close();
    }, 5000);
  }
}
