import { EndpointInterface } from 'bingx-api/bingx/endpoints/endpoint.interface';
import { lastValueFrom } from 'rxjs';
import { BingxRequestInterface } from 'bingx-api/bingx/endpoints/bingx-request.interface';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import * as JSONBigNumber from 'json-bignumber';
import { axiosTransformResponse } from 'bingx-api/bingx/axios-transform-response/axios-transform-response';

export class BingxRequest<R> implements BingxRequestInterface<R> {
  private readonly http = new HttpService(
    axios.create({
      baseURL: 'https://open-api.bingx.com',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      transformResponse: axiosTransformResponse,
    }),
  );

  constructor(private readonly endpoint: EndpointInterface<R>) {}

  async getResponse(): Promise<Readonly<R>> {
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
