import { CommonBusinessErrorCodeEnum } from 'bingx-api/bingx/enums/common-business-error-code.enum';

export interface BingxResponseInterface<T> {
  code: CommonBusinessErrorCodeEnum;
  msg: string;
  data: T;
}
