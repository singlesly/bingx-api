import { EndpointInterface } from '@app/bingx/endpoints/endpoint.interface';
import { BingxResponseInterface } from '@app/bingx/endpoints/bingx-response.interface';

export interface RequestExecutorInterface {
  execute<T>(
    endpoint: EndpointInterface<T>,
  ): Promise<BingxResponseInterface<T>>;
}
