import { BingxRequestInterface } from '@app/bingx/request/bingx-request.interface';
import { AccountInterface } from '@app/bingx/account/account.interface';
import { BingxRequest } from '@app/bingx/request/bingx-request';
import { BingxPerpetualSwapPositionsEndpoint } from '@app/bingx/request/bingx-perpetual-swap-positions-endpoint';
import { BingxResponseInterface } from '@app/bingx/request/bingx-response.interface';
import { OrderPositionSideEnum } from '@app/bingx/enums/order-position-side.enum';

export interface PerpetualSwapPositionsData<
  T extends number | string = string,
> {
  symbol: string;
  positionId: string;
  positionSide: OrderPositionSideEnum;
  isolated: boolean;
  positionAmt: T;
  availableAmt: string;
  unrealizedProfit: T;
  realisedProfit: T;
  initialMargin: T;
  avgPrice: T;
  leverage: number;
}

export class BingxPerpetualSwapPositionsRequest
  implements
    BingxRequestInterface<BingxResponseInterface<PerpetualSwapPositionsData[]>>
{
  private readonly request = new BingxRequest<
    BingxResponseInterface<PerpetualSwapPositionsData[]>
  >(new BingxPerpetualSwapPositionsEndpoint(this.symbol, this.account));

  constructor(
    private readonly symbol: string,
    private readonly account: AccountInterface,
  ) {}

  getResponse(): Promise<BingxResponseInterface<PerpetualSwapPositionsData[]>> {
    return this.request.getResponse();
  }
}
