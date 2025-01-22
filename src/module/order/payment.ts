import coreApi from "../../utils/midtrans.client";
import { vaTransactionSchema, walletTransactionSchema, iVaTransaction, iWalletTransaction } from "../../types/payment";


export default class paymentService {
  static async createVATransaction(vaData: iVaTransaction) {
    try {
      const response = await coreApi.charge(vaData);
      console.log('Transaction Response:', response);
      return response
    } catch (error) {
      console.error('Error creating VA transaction:', error);
      return null;
    }
  }

  static async createWalletTransaction(walletData: iWalletTransaction) {
    try {
      const response = await coreApi.charge(walletData);
      console.log('Transaction Response:', response);
      return response
    } catch (error) {
      console.error('Error creating VA transaction:', error);
      return null;
    }
  }
}


// export const createVATransaction  => {
//   const transactionData = {
//     payment_type: 'bank_transfer',
//     transaction_details: {
//       order_id: `order-${new Date().getTime()}`, // ID unik setiap transaksi
//       gross_amount: 150000 // Jumlah pembayaran (IDR)
//     },
//     bank_transfer: {
//       bank: 'mandiri' // Bank: bca, bni, bri, permata
//     },
//     customer_details: {
//       first_name: 'Budi',
//       last_name: 'Utomo',
//       email: 'budi.utomo@example.com',
//       phone: '+6281234567890'
//     }
//   };

//   try {
//     const response = await coreApi.charge(transactionData);
//     console.log('Transaction Response:', response);

//     return {
//       va_numbers: response.va_numbers,
//       transaction_id: response.transaction_id,
//       order_id: response.order_id,
//       gross_amount: response.gross_amount,
//       transaction_time: response.transaction_time,
//       transaction_status: response.transaction_status
//     };
//   } catch (error) {
//     console.error('Error creating VA transaction:', error);
//     return null;
//   }
// };

export const createEwalletTransaction = async () => {
  const transactionData = {
    payment_type: 'ewallet',
    transaction_details: {
      order_id: `order-${new Date().getTime()}`, // ID unik setiap transaksi
      gross_amount: 150000 // Jumlah pembayaran (IDR)
    },
    ewallet: {
      type: 'dana' // Tipe e-wallet: dana, ovo, gopay
    },
    customer_details: {
      first_name: 'Budi',
      last_name: 'Utomo',
      email: 'budi.utomo@example.com',
      phone: '+6281234567890'
    }
  };
}

