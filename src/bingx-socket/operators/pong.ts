import { filter, Observable, OperatorFunction, Subject, tap } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { HeartbeatInterface } from 'bingx-api/bingx-socket/interfaces/heartbeat.interface';

export function pong<T>(
  socket$: WebSocketSubject<T>,
  listener$?: Subject<HeartbeatInterface>,
): OperatorFunction<T, T> {
  return (source$: Observable<T>) =>
    source$.pipe(
      tap((msg) => {
        if (msg === 'Ping') {
          listener$?.next({
            timestamp: Date.now(),
          });
          return socket$.next('Pong' as T);
        }
      }),
      filter((message) => message !== 'Ping'),
    );
}
