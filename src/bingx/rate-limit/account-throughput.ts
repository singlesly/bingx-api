import { Throughput } from '@app/bingx/rate-limit/throughput';

export class AccountThroughput implements Throughput {
  perSecondValue(): number {
    return 20;
  }

  scope(): 'IP' | 'UID' {
    return 'UID';
  }
}
