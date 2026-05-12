import { Server, WebSocket } from 'ws';
import { getPortFree } from 'bingx-api/get-port';
import { ApiAccount } from 'bingx-api/bingx/account/api-account';
import { BingxAccountSocketStream } from 'bingx-api/bingx-socket/bingx-account-socket-stream';
import * as zlib from 'zlib';
import { AccountWebsocketEventType } from 'bingx-api/bingx-socket/events';

describe('bingx account socket configuration update', () => {
  let wss: Server;
  let port: number;
  let stream: BingxAccountSocketStream | undefined;
  const sockets: WebSocket[] = [];

  const sendToSocket = (socket: WebSocket, msg: string) => {
    zlib.gzip(msg, (err, result) => {
      socket.send(result);
    });
  };

  beforeEach(async () => {
    port = await getPortFree();
    wss = new Server({ port });
    await new Promise<void>((resolve) => {
      wss.on('listening', resolve);
      wss.on('connection', (ws) => {
        sockets[0] = ws;
        ws.on('close', () => {
          sockets.splice(0, 1);
        });
      });
    });
  });

  afterEach((done) => {
    stream?.disconnect();
    wss.close(() => {
      sockets.splice(0, sockets.length);
      done();
    });
  });

  it('emits account configuration update events', (done) => {
    const requestExecutorMock = {
      execute: jest.fn().mockResolvedValueOnce({ listenKey: '123' }),
    };
    const account = new ApiAccount('xxx', 'xxx');

    wss.once('connection', (socket) => {
      setTimeout(() => {
        sendToSocket(
          socket,
          JSON.stringify({
            e: AccountWebsocketEventType.ACCOUNT_CONFIG_UPDATE,
            E: 1676603102163,
            ac: {
              s: 'BTC-USDT',
              l: 12,
              S: 9,
              mt: 'cross',
            },
          }),
        );
      }, 10);
    });

    stream = new BingxAccountSocketStream(account, {
      requestExecutor: requestExecutorMock,
      url: new URL('', `ws://0.0.0.0:${port}`),
    });

    stream.accountConfigurationUpdate$.subscribe((event) => {
      expect(event).toStrictEqual({
        e: AccountWebsocketEventType.ACCOUNT_CONFIG_UPDATE,
        E: '1676603102163',
        ac: {
          s: 'BTC-USDT',
          l: '12',
          S: '9',
          mt: 'cross',
        },
      });
      expect(requestExecutorMock.execute).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
