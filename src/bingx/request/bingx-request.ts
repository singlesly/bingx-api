import { EndpointInterface } from '@app/bingx/request/endpoint.interface';
import { lastValueFrom } from 'rxjs';
import { BingxResponseInterface } from '@app/bingx/request/bingx-response.interface';
import { BingxRequestInterface } from '@app/bingx/request/bingx-request.interface';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ProxyRequestInterface } from '@app/bingx-proxy/request/proxy-request.interface';
import { CorrelationContext } from '@app/context/correlation.context';

const client = ClientProxyFactory.create({
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RMQ_URLS],
    queue: process.env.RMQ_PROXY_QUEUE,
    queueOptions: {
      durable: false,
    },
  },
});

export class BingxRequest<T extends BingxResponseInterface<unknown>>
  implements BingxRequestInterface<T>
{
  private readonly client = client;

  constructor(private readonly endpoint: EndpointInterface) {}

  async getResponse(): Promise<T> {
    const store = CorrelationContext.getStorage();
    return lastValueFrom(
      this.client.send('bingx-proxy-request', {
        method: this.endpoint.method(),
        params: {
          ...this.endpoint.parameters().asRecord(),
        },
        headers: this.endpoint.apiKey().asHeader(),
        url: this.endpoint.path(),
        account: {
          apiKey: this.endpoint.apiKey().asHeader()['X-BX-APIKEY'],
          secretKey: this.endpoint.signature().secretKey(),
        },
        correlationId: store?.getStore()?.correlationId,
      } as ProxyRequestInterface),
    );
    // const response = await lastValueFrom(
    //   this.http.request<T>({
    //     method: this.endpoint.method(),
    //     params: {
    //       ...this.endpoint.parameters().asRecord(),
    //       signature: this.endpoint.signature().toString(),
    //     },
    //     headers: this.endpoint.apiKey().asHeader(),
    //     url: this.endpoint.path(),
    //   }),
    // );
    //
    // return response.data;
  }
}
