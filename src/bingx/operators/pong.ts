import { Observable, tap } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';

export function pong<T>(source: WebSocketSubject<T>): Observable<T> {
  return source.pipe(
    tap((msg) => {
      if (msg === 'Ping') {
        source.next('Pong' as T);
      }
    }),
  );
}
