import { Server, WebSocket } from 'ws';
import { getPortFree } from 'bingx-api/get-port';
import { ApiAccount } from 'bingx-api/bingx/account/api-account';
import { BingxAccountSocketStream } from 'bingx-api/bingx-socket/bingx-account-socket-stream';
import * as zlib from 'zlib';
import { skip } from 'rxjs';

describe('bingx account socket stream', () => {
  let wss: Server;
  let port: number;
  const sockets: WebSocket[] = [];

  beforeAll(async () => {
    port = await getPortFree();
    wss = new Server({
      port,
    });
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

  afterAll(() => {
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

    it('must be got listen key', () => {
      // expect(requestExecutorMock.execute).toHaveBeenCalledTimes(1);
    });

    it('must be got heartbeat', (done) => {
      stream.heartbeat$.subscribe(() => {
        done();
      });
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
      // expect(requestExecutorMock.execute).toHaveBeenCalledTimes(1);
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
});
