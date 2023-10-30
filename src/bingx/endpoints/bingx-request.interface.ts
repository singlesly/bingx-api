import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';

export interface BingxRequestInterface<R> {
  getEndpoint(): Promise<Readonly<EndpointInterface<R>>>;
  getResponse(): Promise<Readonly<R>>;
}
