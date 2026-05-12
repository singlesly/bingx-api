import { Server, WebSocket } from 'ws';
import { getPortFree } from 'bingx-api/get-port';
import * as zlib from 'zlib';
import { BingxMarketSocketStream } from 'bingx-api/bingx-socket/bingx-market-socket-stream';
import { KlineEvent, MarketDepthEvent } from 'bingx-api/bingx-socket/events';

describe('bingx market socket subscriptions', () => {
  let wss: Server;
  let port: number;
  let stream: BingxMarketSocketStream | undefined;
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

  it('subscribes to market depth and emits depth events', (done) => {
    wss.once('connection', (socket) => {
      socket.once('message', (message) => {
        expect(JSON.parse(message.toString())).toStrictEqual({
          id: 'listen-for-BTC-USDT@depth5',
          reqType: 'sub',
          dataType: 'BTC-USDT@depth5',
        });

        sendToSocket(
          socket,
          JSON.stringify({
            code: 0,
            dataType: 'BTC-USDT@depth5',
            data: {
              asks: [{ p: 30100.1, v: 2.5 }],
              bids: [{ p: 30099.9, v: 1.25 }],
            },
          } as MarketDepthEvent),
        );
      });
    });

    stream = new BingxMarketSocketStream(new URL('', `ws://0.0.0.0:${port}`));
    stream.marketDepth$.subscribe((event) => {
      expect(event).toStrictEqual({
        code: '0',
        dataType: 'BTC-USDT@depth5',
        data: {
          asks: [{ p: '30100.1', v: '2.5' }],
          bids: [{ p: '30099.9', v: '1.25' }],
        },
      });
      done();
    });

    stream.subscribeMarketDepth('BTC-USDT', 5);
  });

  it('subscribes to kline and emits kline events', (done) => {
    wss.once('connection', (socket) => {
      socket.once('message', (message) => {
        expect(JSON.parse(message.toString())).toStrictEqual({
          id: 'listen-for-BTC-USDT@kline_1m',
          reqType: 'sub',
          dataType: 'BTC-USDT@kline_1m',
        });

        sendToSocket(
          socket,
          JSON.stringify({
            code: 0,
            dataType: 'BTC-USDT@kline_1m',
            data: {
              c: 30105,
              h: 30120,
              l: 30080,
              o: 30090,
              v: 42.5,
              s: 'BTC-USDT',
            },
          } as KlineEvent),
        );
      });
    });

    stream = new BingxMarketSocketStream(new URL('', `ws://0.0.0.0:${port}`));
    stream.kline$.subscribe((event) => {
      expect(event).toStrictEqual({
        code: '0',
        dataType: 'BTC-USDT@kline_1m',
        data: {
          c: '30105',
          h: '30120',
          l: '30080',
          o: '30090',
          v: '42.5',
          s: 'BTC-USDT',
        },
      });
      done();
    });

    stream.subscribeKline('BTC-USDT', '1m');
  });
});
