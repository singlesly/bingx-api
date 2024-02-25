import { AccountInterface, HttpRequestExecutor } from 'bingx-api/bingx';
import {
  BingxAccountSocketStream,
  BingxAccountSocketStreamConfiguration,
} from 'bingx-api/bingx-socket/bingx-account-socket-stream';
import { map, ReplaySubject, Subject } from 'rxjs';
import { HeartbeatInterface } from 'bingx-api/bingx-socket/interfaces/heartbeat.interface';
import {
  AccountBalanceAndPositionPushEvent,
  AccountOrderUpdatePushEvent,
  ListenKeyExpiredEvent,
} from 'bingx-api/bingx-socket/events/account-websocket-events';

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

    stream.heartbeat$
      .pipe(
        map<HeartbeatInterface, [AccountInterface, HeartbeatInterface]>((v) => [
          account,
          v,
        ]),
      )
      .subscribe((value) => {
        this.heartbeat$.next(value);
      });

    stream.listenKeyExpired$
      .pipe(
        map<ListenKeyExpiredEvent, [AccountInterface, ListenKeyExpiredEvent]>(
          (v) => [account, v],
        ),
      )
      .subscribe((value) => {
        this.listenKeyExpired$.next(value);
      });

    stream.accountBalanceAndPositionPush$
      .pipe(
        map<
          AccountBalanceAndPositionPushEvent,
          [AccountInterface, AccountBalanceAndPositionPushEvent]
        >((v) => [account, v]),
      )
      .subscribe((value) => {
        this.accountBalanceAndPositionPush$.next(value);
      });

    stream.accountOrderUpdatePushEvent$
      .pipe(
        map<
          AccountOrderUpdatePushEvent,
          [AccountInterface, AccountOrderUpdatePushEvent]
        >((v) => [account, v]),
      )
      .subscribe((value) => {
        this.accountOrderUpdatePushEvent$.next(value);
      });

    if (this.accounts[account.getApiKey()]) {
      this.accounts[account.getApiKey()][1].disconnect();
    }

    this.accounts[account.getApiKey()] = [account, stream];
  }

  public getAccounts() {
    return this.accounts;
  }

  public removeAccount(account: AccountInterface) {
    if (this.accounts[account.getApiKey()]) {
      const [sacrifice, stream] = this.accounts[account.getApiKey()];
      stream.disconnect();
      delete this.accounts[sacrifice.getApiKey()];
    }
  }
}
