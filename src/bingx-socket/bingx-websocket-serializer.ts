import {
  WebSocketMessage,
  WebSocketSubjectConfig,
} from 'rxjs/internal/observable/dom/WebSocketSubject';

export class BingxWebsocketSerializer
  implements Required<Pick<WebSocketSubjectConfig<any>, 'serializer'>>
{
  serializer(value: any): WebSocketMessage {
    if (typeof value === 'string') {
      return value;
    }

    return JSON.stringify(value);
  }
}
