import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { BINGX_API_KEY_HEADER } from '@app/bingx/constants';
import { AccountInterface } from '@app/bingx/account/account.interface';

@Injectable()
export class BingxListenKeyService {
  constructor(private readonly http: HttpService) {}

  public async generateListenKey(account: AccountInterface): Promise<{
    listenKey: string;
  }> {
    const response = await lastValueFrom(
      this.http.post(
        '/openApi/user/auth/userDataStream',
        {},
        {
          headers: {
            [BINGX_API_KEY_HEADER]: account.getApiKey(),
          },
        },
      ),
    );

    return response.data;
  }
}
