import { BingxResponseInterface } from '@app/bingx/request/bingx-response.interface';

export interface BingxRequestInterface<
  T extends BingxResponseInterface<unknown>,
> {
  getResponse(): Promise<T>;
}
