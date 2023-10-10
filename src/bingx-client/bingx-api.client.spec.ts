import { BingxApiClient } from '@app/bingx-client/bingx-api.client';
import { HttpRequestExecutor } from '@app/bingx';
import { ListenKeyService } from '@app/bingx-client/services/listen-key.service';
import { TradeService } from '@app/bingx-client/services/trade.service';
import { AccountService } from '@app/bingx-client/services/account.service';

describe('bingx api client', () => {
  describe('initialize with services', () => {
    let client: BingxApiClient;
    beforeEach(() => {
      client = new BingxApiClient(new HttpRequestExecutor());
    });

    it('must be initialize listen key service', () => {
      expect(client.getListenKeyService()).toBeInstanceOf(ListenKeyService);
    });

    it('must be initialize trade service', () => {
      expect(client.getTradeService()).toBeInstanceOf(TradeService);
    });

    it('must be initialize account service', () => {
      expect(client.getAccountService()).toBeInstanceOf(AccountService);
    });
  });
});
