import { WebSocketSubjectConfig } from 'rxjs/internal/observable/dom/WebSocketSubject';
import zlib from 'zlib';

export class BingxWebsocketDeserializer
  implements Required<Pick<WebSocketSubjectConfig<any>, 'deserializer'>>
{
  deserializer(e: MessageEvent): any {
    const message = zlib.unzipSync(e.data).toString('utf-8');

    try {
      return JSON.parse(message);
    } catch (e) {
      return message;
    }
  }
}
