import { Server, WebSocket } from 'ws';
import { getPortFree } from 'bingx-api/get-port';
import { ApiAccount } from 'bingx-api/bingx/account/api-account';
import { BingxAccountSocketStream } from 'bingx-api/bingx-socket/bingx-account-socket-stream';
import * as zlib from 'zlib';
import { skip } from 'rxjs';
import {
  AccountOrderUpdatePushEvent,
  AccountWebsocketEventType,
} from 'bingx-api/bingx-socket/events';

describe('bingx account socket stream', () => {
  let wss: Server;
  let port: number;
  const sockets: WebSocket[] = [];
  const sendToSocket = (socket: WebSocket, msg: string) => {
    zlib.gzip(msg, (err, result) => {
      socket.send(result);
    });
  };

  beforeAll(async () => {
    return new Promise(async (resolve) => {
      port = await getPortFree();
      wss = new Server({
        port,
      });
      wss.on('listening', resolve);
      wss.on('connection', (ws) => {
        sockets[0] = ws;

        ws.on('close', () => {
          sockets.splice(0, 1);
        });

        setInterval(() => {
          zlib.gzip('Ping', (err, result) => {
            ws.send(result);
          });
        }, 200);
      });
    });
  });

  afterAll((done) => {
    wss.on('close', done);
    wss.close();
  });

  it('websocket server is running', () => {
    expect(wss.address()).toMatchObject({
      port,
    });
  });

  describe('initialize connect', () => {
    const requestExecutorMock = {
      execute: jest.fn().mockResolvedValueOnce({ data: { listenKey: '123' } }),
    };
    let stream: BingxAccountSocketStream;
    beforeAll(() => {
      const account = new ApiAccount('xxx', 'xxx');
      stream = new BingxAccountSocketStream(account, {
        requestExecutor: requestExecutorMock,
        url: new URL('', `ws://0.0.0.0:${port}`),
      });
    });

    afterAll(() => {
      stream.disconnect();
    });

    it('must be got listen key', () => {
      expect(requestExecutorMock.execute).toHaveBeenCalledTimes(1);
    });

    it('must be got heartbeat', (done) => {
      stream.heartbeat$.subscribe(() => {
        done();
      });
    });
  });

  describe('force disconnect', () => {
    const requestExecutorMock = {
      execute: jest.fn().mockResolvedValueOnce({ data: { listenKey: '123' } }),
    };
    let stream: BingxAccountSocketStream;
    beforeAll(() => {
      const account = new ApiAccount('xxx', 'xxx');
      stream = new BingxAccountSocketStream(account, {
        requestExecutor: requestExecutorMock,
        url: new URL('', `ws://0.0.0.0:${port}`),
      });
    });

    afterAll(() => {
      stream.disconnect();
    });

    it('must be got listen key', () => {
      expect(requestExecutorMock.execute).toHaveBeenCalledTimes(1);
    });

    it('must be got disconnected', (done) => {
      let hb = false;
      stream.heartbeat$.subscribe(() => {
        stream.disconnect();
        stream.onDisconnect$.subscribe(() => {
          stream.heartbeat$.pipe(skip(1)).subscribe(() => {
            hb = true;
          });
          setTimeout(() => {
            expect(hb).toBeFalsy();
            done();
          }, 1000);
        });
      });
    });
  });

  describe('automatically reconnect', () => {
    const requestExecutorMock = {
      execute: jest
        .fn()
        .mockResolvedValueOnce({ data: { listenKey: '123' } })
        .mockResolvedValueOnce({ data: { listenKey: '123' } }),
    };
    let stream: BingxAccountSocketStream;
    beforeAll(() => {
      const account = new ApiAccount('xxx', 'xxx');
      stream = new BingxAccountSocketStream(account, {
        requestExecutor: requestExecutorMock,
        url: new URL('', `ws://0.0.0.0:${port}`),
      });
    });

    afterAll(() => {
      stream.disconnect();
    });

    it('must be reconnect', (done) => {
      stream.heartbeat$.subscribe(() => {
        expect(sockets).toHaveLength(1);
        sockets[0].close();
        stream.onDisconnect$.subscribe((e) => {
          expect(e.code).toStrictEqual(1005);
          stream.heartbeat$.pipe(skip(1)).subscribe(() => {
            done();
          });
        });
      });
    });
  });

  describe('order trade update', () => {
    const requestExecutorMock = {
      execute: jest.fn().mockResolvedValueOnce({ data: { listenKey: '123' } }),
    };
    let stream: BingxAccountSocketStream;
    beforeAll(() => {
      const account = new ApiAccount('xxx', 'xxx');
      stream = new BingxAccountSocketStream(account, {
        requestExecutor: requestExecutorMock,
        url: new URL('', `ws://0.0.0.0:${port}`),
      });
    });

    afterAll(() => {
      stream.disconnect();
    });

    it('must be got listen key', () => {
      expect(requestExecutorMock.execute).toHaveBeenCalledTimes(1);
    });

    it('must be got order push', (done) => {
      stream.accountOrderUpdatePushEvent$.subscribe((e) => {
        expect(e).toStrictEqual({
          e: AccountWebsocketEventType.ORDER_TRADE_UPDATE,
          o: {},
          E: '111',
        } as AccountOrderUpdatePushEvent);
        done();
      });
      setTimeout(() => {
        sendToSocket(
          sockets[0],
          JSON.stringify({
            e: AccountWebsocketEventType.ORDER_TRADE_UPDATE,
            o: {},
            E: '111',
          } as AccountOrderUpdatePushEvent),
        );
      }, 1000);
    });
  });

  describe('#68 fix big number in order identifier', () => {
    const requestExecutorMock = {
      execute: jest.fn().mockResolvedValueOnce({ data: { listenKey: '123' } }),
    };
    let stream: BingxAccountSocketStream;
    beforeAll(() => {
      const account = new ApiAccount('xxx', 'xxx');
      stream = new BingxAccountSocketStream(account, {
        requestExecutor: requestExecutorMock,
        url: new URL('', `ws://0.0.0.0:${port}`),
      });
    });

    afterAll(() => {
      stream.disconnect();
    });

    it('must be got listen key', () => {
      expect(requestExecutorMock.execute).toHaveBeenCalledTimes(1);
    });

    it('must be got order push', (done) => {
      stream.accountOrderUpdatePushEvent$.subscribe((e) => {
        expect(e).toStrictEqual({
          e: AccountWebsocketEventType.ORDER_TRADE_UPDATE,
          o: {
            N: 'USDT',
            S: 'BUY',
            T: '0',
            X: 'NEW',
            c: '',
            i: '172998235239792314304',
            n: '0.00000000',
            o: 'TRIGGER_MARKET',
            p: '',
            q: '0.00100000',
            s: 'BTC-USDT',
            x: 'TRADE',
            z: '0.00000000',
            ap: '0.00000000',
            ps: 'LONG',
            rp: '0.00000000',
            sp: '43495.00000000',
            wt: 'MARK_PRICE',
          },
          E: '1706736600541',
        } as AccountOrderUpdatePushEvent);
        done();
      });
      setTimeout(() => {
        sendToSocket(
          sockets[0],
          '{"E":1706736600541,"e":"ORDER_TRADE_UPDATE","o":{"N":"USDT","S":"BUY","T":0,"X":"NEW","c":"","i":172998235239792314304,' +
            '"n":"0.00000000","o":"TRIGGER_MARKET","p":"","q":"0.00100000","s":"BTC-USDT",' +
            '"x":"TRADE","z":"0.00000000","ap":"0.00000000","ps":"LONG","rp":"0.00000000","sp":"43495.00000000","wt":"MARK_PRICE"}}',
        );
      }, 1000);
    });
  });
});
