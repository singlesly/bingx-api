import { CommonBusinessErrorCodeEnum } from '@app/bingx/enums/common-business-error-code.enum';

export interface BingxResponseInterface<T> {
  code: CommonBusinessErrorCodeEnum;
  msg: string;
  data: T;
}
