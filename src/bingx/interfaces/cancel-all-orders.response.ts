export interface BingxOrder {
  time: number;
  symbol: string;
  side: string;
  type: string;
  positionSide: string;
  cumQuote: string;
  status: string;
  stopPrice: string;
  price: string;
  origQty: string;
  avgPrice: string;
  executedQty: string;
  orderId: number;
  profit: string;
  commission: string;
  updateTime: number;
}

export interface CancelAllOrdersResponse {
  success: BingxOrder[];
  failed: BingxOrder[];
  orderId: number;
  errorCode: number;
  errorMessage: string;
}
