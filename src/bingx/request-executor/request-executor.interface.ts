import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';

export interface RequestExecutorInterface {
  execute<T>(endpoint: EndpointInterface<T>): Promise<T>;
}
