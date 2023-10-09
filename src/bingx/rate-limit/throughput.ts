export interface Throughput {
  perSecondValue(): number;
  scope(): 'IP' | 'UID';
}
