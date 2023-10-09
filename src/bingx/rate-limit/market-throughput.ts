import { Throughput } from '@app/bingx/rate-limit/throughput';

export class MarketThroughput implements Throughput {
  perSecondValue(): number {
    return 60;
  }

  scope(): 'IP' | 'UID' {
    return 'IP';
  }
}
