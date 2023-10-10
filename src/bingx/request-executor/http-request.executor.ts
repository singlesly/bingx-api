import { RequestExecutorInterface } from '@app/bingx/request-executor/request-executor.interface';
import { EndpointInterface } from '@app/bingx/endpoints/endpoint.interface';
import { BingxResponseInterface } from '@app/bingx/endpoints/bingx-response.interface';
import { BingxRequest } from '@app/bingx/endpoints/bingx-request';

export class HttpRequestExecutor implements RequestExecutorInterface {
  execute<T>(
    endpoint: EndpointInterface<T>,
  ): Promise<BingxResponseInterface<T>> {
    return new BingxRequest(endpoint).getResponse();
  }
}
