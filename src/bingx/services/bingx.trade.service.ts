import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { TradeOrderInterface } from '@app/bingx/interfaces/trade-order.interface';
import { AccountInterface } from '@app/bingx/account/account.interface';
import { catchError, lastValueFrom } from 'rxjs';
import { BINGX_API_KEY_HEADER } from '@app/bingx/constants';
import { SwitchLeverageInterface } from '@app/bingx/interfaces/switch-leverage.interface';
import { CancelAllOrdersResponse } from '@app/bingx/interfaces/cancel-all-orders.response';
import { BingxOrderInterface } from '@app/bingx/interfaces/bingx-order.interface';
import { QueryOrderInterface } from '@app/bingx/interfaces/query-order.interface';
import { BingxResponse } from '@app/bingx/interfaces/bingx-response';
import { DefaultSignatureParameters } from '@app/bingx/account/default-signature-parameters';

@Injectable()
export class BingxTradeService {
  constructor(private readonly http: HttpService) {}

  public async createOrder(
    order: TradeOrderInterface,
    account: AccountInterface,
  ): Promise<{ orderId: number }> {
    const params = new DefaultSignatureParameters({
      symbol: 'BTC-USDT',
      ...order,
    });
    const signature = account.sign(params);

    const response = await lastValueFrom(
      this.http.post<BingxResponse<{ order: { orderId: number } }>>(
        '/openApi/swap/v2/trade/order',
        {},
        {
          params: { ...params.asRecord(), signature },
          headers: {
            [BINGX_API_KEY_HEADER]: account.getApiKey(),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );

    if (response.data.code !== 0) {
      throw new InternalServerErrorException({
        response: response.data,
        order: order,
      });
    }

    return response.data.data.order;
  }

  public async createTestOrder(
    order: TradeOrderInterface,
    account: AccountInterface,
  ): Promise<{ orderId: number }> {
    const params = new DefaultSignatureParameters({
      symbol: 'BTC-USDT',
      ...order,
    });
    const signature = account.sign(params);

    const response = await lastValueFrom(
      this.http.post(
        '/openApi/swap/v2/trade/order/test',
        {},
        {
          params: { ...params.asRecord(), signature },
          headers: {
            [BINGX_API_KEY_HEADER]: account.getApiKey(),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );

    return response.data.data.order;
  }

  public async queryOrder(
    options: QueryOrderInterface,
    account: AccountInterface,
  ): Promise<BingxOrderInterface> {
    const params = new DefaultSignatureParameters({
      symbol: options.symbol,
      orderId: options.orderId,
    });
    const signature = account.sign(params);

    const response = await lastValueFrom(
      this.http.get('/openApi/swap/v2/trade/order', {
        params: { signature, ...params.asRecord() },
        headers: {
          [BINGX_API_KEY_HEADER]: account.getApiKey(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    );

    return response.data.data.order;
  }

  public async queryAllPendingOrders(
    options: Omit<QueryOrderInterface, 'orderId'>,
    account: AccountInterface,
  ): Promise<BingxOrderInterface[]> {
    const params = new DefaultSignatureParameters({
      symbol: options.symbol,
    });
    const signature = account.sign(params);

    const response = await lastValueFrom(
      this.http.get('/openApi/swap/v2/trade/openOrders', {
        params: { signature, ...params.asRecord() },
        headers: {
          [BINGX_API_KEY_HEADER]: account.getApiKey(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    );

    return response.data.data;
  }

  public async queryHistoricalTransactionOrder(
    options: { orderId?: number; symbol: string },
    account: AccountInterface,
  ): Promise<unknown> {
    const params = new DefaultSignatureParameters({
      symbol: options.symbol,
      tradingUnit: 'COIN',
      startTs: String(Date.now() - 86400 * 1000),
      endTs: Date.now().toString(),
      orderId: options.orderId ? options.orderId.toString() : null,
    });

    const signature = account.sign(params);

    const response = await lastValueFrom(
      this.http.get('/openApi/swap/v2/trade/allFillOrders', {
        params: { ...params.asRecord(), signature },
        headers: {
          [BINGX_API_KEY_HEADER]: account.getApiKey(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    );

    return response.data.data;
  }

  public async getLeverage(
    symbol: string,
    account: AccountInterface,
  ): Promise<{ longLeverage: string; shortLeverage: string }> {
    const params = new DefaultSignatureParameters({
      symbol,
    });
    const signature = account.sign(params);
    const response = await lastValueFrom(
      this.http.get('/openApi/swap/v2/trade/leverage', {
        params: { signature, ...params.asRecord() },
        headers: {
          [BINGX_API_KEY_HEADER]: account.getApiKey(),
        },
      }),
    );

    return response.data.data;
  }

  public async switchLeverage(
    options: SwitchLeverageInterface,
    account: AccountInterface,
  ): Promise<{ symbol: string; leverage: number }> {
    const params = new DefaultSignatureParameters({
      symbol: options.symbol,
      side: options.side,
      leverage: options.leverage.toString(),
    });
    const signature = account.sign(params).toString();

    const response = await lastValueFrom(
      this.http.post(
        '/openApi/swap/v2/trade/leverage',
        {},
        {
          params: { ...params.asRecord(), signature },
          headers: {
            [BINGX_API_KEY_HEADER]: account.getApiKey(),
          },
        },
      ),
    ).catch((e) => {
      return e;
    });

    console.log(response.data);
    console.log(response.config);

    if (response.data.code !== 0) {
      throw new InternalServerErrorException({
        response: response.data,
      });
    }

    return response.data.data;
  }

  public async cancelAllOrders(
    symbol: string,
    account: AccountInterface,
  ): Promise<CancelAllOrdersResponse> {
    const params = new DefaultSignatureParameters({
      symbol,
    });
    const signature = account.sign(params);

    const response = await lastValueFrom(
      this.http.delete('/openApi/swap/v2/trade/allOpenOrders', {
        params: { ...params, signature },
        headers: {
          [BINGX_API_KEY_HEADER]: account.getApiKey(),
        },
      }),
    );

    console.log(response.data);
    console.log(response.config);

    if (response.data.code !== 0) {
      throw new InternalServerErrorException({
        response: response.data,
      });
    }

    return response.data.data;
  }

  public async closeAllPositions(account: AccountInterface) {
    const params = new DefaultSignatureParameters();
    const signature = account.sign(params);

    const response = await lastValueFrom(
      this.http.post(
        '/openApi/swap/v2/trade/closeAllPositions',
        {},
        {
          params: { ...params.asRecord(), signature },
          headers: {
            [BINGX_API_KEY_HEADER]: account.getApiKey(),
          },
        },
      ),
    );

    console.log(response.data);
    console.log(response.config);

    if (response.data.code !== 0) {
      throw new InternalServerErrorException({
        response: response.data,
      });
    }

    return response.data.data;
  }
}
