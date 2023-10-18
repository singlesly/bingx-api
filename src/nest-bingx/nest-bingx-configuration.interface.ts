import { ModuleMetadata, Type } from '@nestjs/common';
import { RequestExecutorInterface } from 'bingx-api/bingx';

export interface NestBingxConfigurationInterface
  extends Pick<ModuleMetadata, 'providers' | 'imports'> {
  requestExecutor?: Type<RequestExecutorInterface>;
}
