import { RequestExecutorInterface } from 'bingx-api/bingx/request-executor/request-executor.interface';
import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { BingxRequest } from 'bingx-api/bingx/endpoints/bingx-request';

export class HttpRequestExecutor implements RequestExecutorInterface {
  execute<T>(endpoint: EndpointInterface<T>): Promise<T> {
    return new BingxRequest(endpoint).getResponse();
  }
}
