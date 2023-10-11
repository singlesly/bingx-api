import { BingxResponseInterface } from '@app/bingx/endpoints/bingx-response.interface';
import { EndpointInterface } from '@app/bingx/endpoints/endpoint.interface';

export interface BingxRequestInterface<R> {
  getEndpoint(): Promise<Readonly<EndpointInterface<R>>>;
  getResponse(): Promise<Readonly<R>>;
}
