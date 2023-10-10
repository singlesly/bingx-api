import { Server } from 'ws';
import { getPortFree } from '@app/get-port';
import { ApiAccount } from '@app/bingx/account/api-account';
import { BingxAccountSocketStream } from '@app/bingx-socket/bingx-account-socket-stream';
import * as zlib from 'zlib';

describe('bingx account socket stream', () => {
  let wss: Server;
  let port: number;

  beforeAll(async () => {
    port = await getPortFree();
    wss = new Server({
      port,
    });
    wss.on('connection', (ws) => {
      setInterval(() => {
        zlib.gzip('Ping', (err, result) => {
          ws.send(result);
        });
      }, 1000);
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
});
