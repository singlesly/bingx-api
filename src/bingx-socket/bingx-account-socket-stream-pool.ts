import { AccountInterface, HttpRequestExecutor } from '@app/bingx';
import {
  BingxAccountSocketStream,
  BingxAccountSocketStreamConfiguration,
} from '@app/bingx-socket/bingx-account-socket-stream';
import { map, ReplaySubject, Subject } from 'rxjs';
import { HeartbeatInterface } from '@app/bingx-socket/interfaces/heartbeat.interface';
import {
  AccountBalanceAndPositionPushEvent,
  AccountOrderUpdatePushEvent,
  ListenKeyExpiredEvent,
} from '@app/bingx-socket/events/account-websocket-events';

export class BingxAccountSocketStreamPool {
  private readonly configuration: Required<BingxAccountSocketStreamConfiguration>;

  private readonly accounts: Record<
    string,
    [AccountInterface, BingxAccountSocketStream]
  > = {};

  public readonly heartbeat$ = new ReplaySubject<
    [AccountInterface, HeartbeatInterface]
  >(1);
  public readonly listenKeyExpired$ = new Subject<
    [AccountInterface, ListenKeyExpiredEvent]
  >();
  public readonly accountBalanceAndPositionPush$ = new Subject<
    [AccountInterface, AccountBalanceAndPositionPushEvent]
  >();
  public readonly accountOrderUpdatePushEvent$ = new Subject<
    [AccountInterface, AccountOrderUpdatePushEvent]
  >();

  constructor(
    accounts: AccountInterface[],
    configuration: BingxAccountSocketStreamConfiguration = {},
  ) {
    this.configuration = {
      requestExecutor:
        configuration.requestExecutor ?? new HttpRequestExecutor(),
      url:
        configuration.url ??
        new URL('/swap-market', 'wss://open-api-swap.bingx.com'),
    };

    accounts.forEach((account) => this.addAccount(account));
  }

  public addAccount(account: AccountInterface) {
    const stream = new BingxAccountSocketStream(account, this.configuration);

    stream.heartbeat$.pipe(map((v) => [account, v]));
    stream.listenKeyExpired$.pipe(map((v) => [account, v]));
    stream.accountBalanceAndPositionPush$.pipe(map((v) => [account, v]));
    stream.accountOrderUpdatePushEvent$.pipe(map((v) => [account, v]));

    this.accounts[account.getApiKey()] = [account, stream];
  }

  public removeAccount(account: AccountInterface) {
    if (this.accounts[account.getApiKey()]) {
      const [sacrifice, stream] = this.accounts[account.getApiKey()];
      stream.disconnect();
      delete this.accounts[sacrifice.getApiKey()];
    }
  }
}
