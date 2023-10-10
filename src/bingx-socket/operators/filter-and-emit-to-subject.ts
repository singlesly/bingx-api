import { OperatorFunction, Subject, Observable } from 'rxjs';

export function filterAndEmitToSubject<T, R extends T>(
  predicate: (value: T) => value is R,
  subject$: Subject<R>,
): OperatorFunction<T, T> {
  return (source) => {
    return new Observable<T>((observer) => {
      return source.subscribe({
        next(value) {
          if (predicate(value)) {
            subject$.next(value);
          }
          observer.next(value);
        },
        error(error) {
          observer.error(error);
        },
        complete() {
          observer.complete();
        },
      });
    });
  };
}
