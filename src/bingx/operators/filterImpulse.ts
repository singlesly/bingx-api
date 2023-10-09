import { bufferTime, filter, map, Observable, OperatorFunction } from 'rxjs';

export function filterImpulse(
  time = 30_000,
  short = 100,
  long = 500,
): OperatorFunction<any, any> {
  return (source: Observable<Record<string, number>>) =>
    source.pipe(
      bufferTime(time),
      map((prices) => {
        return prices.flatMap((price) => {
          return Object.values(price)[0];
        });
      }),
      filter((prices) => {
        const shortImpulseValue = short;
        const last = prices.slice(-5);
        return Math.min(...last) - Math.max(...last) <= shortImpulseValue;
      }),
      filter((prices) => {
        return Math.min(...prices) - Math.max(...prices) <= long;
      }),
    );
}
