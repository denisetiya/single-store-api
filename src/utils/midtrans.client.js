
import midtransClient from 'midtrans-client';

import dotenv from 'dotenv';

dotenv.config();

const coreApi = new midtransClient.CoreApi({
  isProduction: false, 
  serverKey: process.env.MIDTRANS_SERVER_KEY, 
  clientKey: process.env.MIDTRANS_CLIENT_KEY  
});

export default coreApi;
