import { AccountInterface } from 'bingx-api/bingx/account/account.interface';

export class ApiKeyHeader {
  constructor(private readonly apiKey: string | AccountInterface) {}

  asHeader() {
    return {
      'X-BX-APIKEY':
        typeof this.apiKey === 'string' ? this.apiKey : this.apiKey.getApiKey(),
    };
  }
}
