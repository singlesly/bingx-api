import { WebSocketSubjectConfig } from 'rxjs/internal/observable/dom/WebSocketSubject';
import * as zlib from 'zlib';
import * as JSONBigNumber from 'json-bignumber';

export class BingxWebsocketDeserializer
  implements Required<Pick<WebSocketSubjectConfig<any>, 'deserializer'>>
{
  deserializer(e: MessageEvent): any {
    const message = zlib.unzipSync(e.data).toString('utf-8');

    try {
      return JSON.parse(JSON.stringify(JSONBigNumber.parse(message)));
    } catch (e) {
      return message;
    }
  }
}
