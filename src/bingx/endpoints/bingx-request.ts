import { EndpointInterface } from '@app/bingx/endpoints/endpoint.interface';
import { lastValueFrom } from 'rxjs';
import { BingxRequestInterface } from '@app/bingx/endpoints/bingx-request.interface';
import { HttpService } from '@nestjs/axios';
import { BingxResponseInterface } from '@app/bingx/endpoints/bingx-response.interface';
import axios from 'axios';

export class BingxRequest<R> implements BingxRequestInterface<R> {
  private readonly http = new HttpService(
    axios.create({
      baseURL: 'https://open-api.bingx.com',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }),
  );

  constructor(private readonly endpoint: EndpointInterface<R>) {}

  async getResponse(): Promise<Readonly<BingxResponseInterface<R>>> {
    const response = await lastValueFrom(
      this.http.request({
        method: this.endpoint.method(),
        params: {
          ...this.endpoint.parameters().asRecord(),
          signature: this.endpoint.signature().toString(),
        },
        headers: this.endpoint.apiKey().asHeader(),
        url: this.endpoint.path(),
      }),
    );

    return response.data;
  }

  async getEndpoint(): Promise<Readonly<EndpointInterface<R>>> {
    return this.endpoint;
  }
}
