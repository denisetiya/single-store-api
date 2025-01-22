// src/types/midtrans-client.d.ts
declare module 'midtrans-client' {
    // Definisikan interface untuk response API
    export interface CoreApiResponse {
      va_numbers: Array<{
        bank: string;
        va_number: string;
      }>;
      transaction_id: string;
      order_id: string;
      gross_amount: string;
      transaction_time: string;
      transaction_status: string;
    }
  
    // Definisikan interface untuk CoreApi
    export interface CoreApi {
      charge(transactionData: any): Promise<CoreApiResponse>;
    }
  
    // Definisikan class CoreApi dengan konstruktor
    export class CoreApi {
      constructor(config: {
        isProduction: boolean;
        serverKey: string;
        clientKey: string;
      });
      charge(transactionData: any): Promise<CoreApiResponse>;
    }
  
    // Ekspor default midtransClient sebagai objek dengan tipe `any`
    const midtransClient: any;
    export default midtransClient;
  }
  