import { EndpointInterface } from '@app/bingx/endpoints/endpoint.interface';

export interface RequestExecutorInterface {
  execute<T>(endpoint: EndpointInterface<T>): Promise<T>;
}
