import { Server, WebSocket } from 'ws';
import { getPortFree } from 'bingx-api/get-port';
import * as zlib from 'zlib';
import { first, skip } from 'rxjs';
import { BingxMarketSocketStream } from 'bingx-api/bingx-socket/bingx-market-socket-stream';
import { MarkerWebsocketEventCode } from 'bingx-api/bingx-socket/events';

describe('bingx market socket stream', () => {
  let wss: Server;
  let port: number;
  const sockets: WebSocket[] = [];
  const receivedMessages: unknown[] = [];
  const sendToSocket = (socket: WebSocket, msg: string) => {
    zlib.gzip(msg, (err, result) => {
      socket.send(result);
    });
  };

  beforeAll(async () => {
    port = await getPortFree();
    wss = new Server({
      port,
    });
    wss.on('connection', (ws) => {
      sockets[0] = ws;

      ws.on('close', () => {
        if (sockets[0] === ws) {
          sockets.splice(0, 1);
        }
        clearInterval(pingInterval);
      });

      ws.on('message', (message) => {
        const payload = message.toString();

        if (payload !== 'Pong') {
          receivedMessages.push(JSON.parse(payload));
        }
      });

      const pingInterval = setInterval(() => {
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
    let stream: BingxMarketSocketStream;
    beforeAll(() => {
      stream = new BingxMarketSocketStream(new URL('', `ws://0.0.0.0:${port}`));
    });

    afterAll(() => {
      stream.disconnect();
    });

    it('must be got heartbeat', (done) => {
      stream.heartbeat$.subscribe(() => {
        done();
      });
    });
  });

  describe('initialize connect', () => {
    let stream: BingxMarketSocketStream;
    beforeAll(() => {
      stream = new BingxMarketSocketStream(new URL('', `ws://0.0.0.0:${port}`));
    });

    afterAll(() => {
      stream.disconnect();
    });

    it('must be got heartbeat', (done) => {
      stream.heartbeat$.subscribe(() => {
        done();
      });
    });
  });

  describe('force disconnect', () => {
    let stream: BingxMarketSocketStream;
    beforeAll(() => {
      stream = new BingxMarketSocketStream(new URL('', `ws://0.0.0.0:${port}`));
    });

    afterAll(() => {
      stream.disconnect();
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
    let stream: BingxMarketSocketStream;
    beforeAll(() => {
      stream = new BingxMarketSocketStream(new URL('', `ws://0.0.0.0:${port}`));
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

  describe('market data subscriptions', () => {
    let stream: BingxMarketSocketStream;

    beforeEach(() => {
      receivedMessages.splice(0);
      stream = new BingxMarketSocketStream(new URL('', `ws://0.0.0.0:${port}`));
    });

    afterEach(() => {
      stream.disconnect();
    });

    it('subscribes to market depth and emits depth events', (done) => {
      stream.marketDepth$.subscribe((event) => {
        expect(event).toStrictEqual({
          code: MarkerWebsocketEventCode.NORMAL.toString(),
          dataType: 'BTC-USDT@depth20@500ms',
          data: {
            bids: [['100', '1']],
            asks: [['101', '2']],
            T: '1777593600000',
          },
        });
        done();
      });

      stream.heartbeat$.pipe(first()).subscribe(() => {
        stream.subscribeMarketDepth('BTC-USDT', 20, '500ms');

        setTimeout(() => {
          expect(receivedMessages).toContainEqual({
            id: 'listen-for-BTC-USDT@depth20@500ms',
            reqType: 'sub',
            dataType: 'BTC-USDT@depth20@500ms',
          });
          sendToSocket(
            sockets[0],
            JSON.stringify({
              code: MarkerWebsocketEventCode.NORMAL,
              dataType: 'BTC-USDT@depth20@500ms',
              data: {
                bids: [[100, 1]],
                asks: [[101, 2]],
                T: 1777593600000,
              },
            }),
          );
        }, 100);
      });
    });

    it('subscribes to K-Line data and emits kline events', (done) => {
      stream.kline$.subscribe((event) => {
        expect(event).toStrictEqual({
          code: MarkerWebsocketEventCode.NORMAL.toString(),
          dataType: 'BTC-USDT@kline_1m',
          data: {
            s: 'BTC-USDT',
            K: {
              t: '1777593600000',
              T: '1777593659999',
              o: '100',
              h: '110',
              l: '90',
              c: '105',
              v: '10',
            },
          },
        });
        done();
      });

      stream.heartbeat$.pipe(first()).subscribe(() => {
        stream.subscribeKline('BTC-USDT', '1m');

        setTimeout(() => {
          expect(receivedMessages).toContainEqual({
            id: 'listen-for-BTC-USDT@kline_1m',
            reqType: 'sub',
            dataType: 'BTC-USDT@kline_1m',
          });
          sendToSocket(
            sockets[0],
            JSON.stringify({
              code: MarkerWebsocketEventCode.NORMAL,
              dataType: 'BTC-USDT@kline_1m',
              data: {
                s: 'BTC-USDT',
                K: {
                  t: 1777593600000,
                  T: 1777593659999,
                  o: 100,
                  h: 110,
                  l: 90,
                  c: 105,
                  v: 10,
                },
              },
            }),
          );
        }, 100);
      });
    });
  });
});
