import { ApiAccount } from '@app/bingx/account/api-account';
import { BingxRequestInterface } from '@app/bingx/endpoints/bingx-request.interface';
import { BingxResponseInterface } from '@app/bingx/endpoints/bingx-response.interface';
import { EndpointInterface } from '@app/bingx/endpoints/endpoint.interface';
import { BingxRequest } from '@app/bingx/endpoints/bingx-request';
import { BingxGenerateListenKeyEndpoint } from '@app/bingx/endpoints/bingx-generate-listen-key-endpoint';

async function examples() {
  /** Basic usage **/
  const account = new ApiAccount('aaaa', 'ddd');

  const listenKeyResponseBingxResponse = await new BingxRequest(
    new BingxGenerateListenKeyEndpoint(account),
  ).getResponse();

  console.log(listenKeyResponseBingxResponse);

  /**
   * {
   *   code: 0,
   *   msg: "success",
   *   data: {
   *     listenKey: 'dawddawdda'
   *   }
   * }
   */

  /** Override Request Class **/
  class RmqCustomRequest<T> implements BingxRequestInterface<T> {
    constructor(private readonly endpoint: EndpointInterface<T>) {}

    async getEndpoint(): Promise<Readonly<EndpointInterface<T>>> {
      return this.endpoint;
    }

    getResponse(): Promise<Readonly<BingxResponseInterface<T>>> {
      /**
       * Logic to send request via rmq
       */

      return {} as never;
    }
  }

  const response = await new RmqCustomRequest(
    new BingxGenerateListenKeyEndpoint(account),
  ).getResponse();

  console.log(response);
  /**
   * {
   *   code: 0,
   *   msg: "success",
   *   data: {
   *     listenKey: 'dawddawdda'
   *   }
   * }
   */
}

examples().then();
