import { z } from "zod";



const paymentTypeEnum = z.enum(["bank_transfer", "credit_card", "gopay"]).refine(
  (value) => ["bank_transfer", "credit_card", "gopay"].includes(value),
  {
    message: "Invalid payment type: sorry we not support this payment type",
  }
);

const transactionDetailsSchema = z.object({
  order_id: z.string().startsWith("order-"),
  gross_amount: z.number().positive(),
});

const itemDetailsSchema = z.object({
  id: z.string(),
  price: z.number().positive(),
  quantity: z.number().positive(),
  name : z.string(),
  merchant_name : z.string(),
})

export const vaTransactionSchema = z.object({
  payment_type: paymentTypeEnum,
  transaction_details: transactionDetailsSchema,
  bank_transfer: z.object({
    bank: z.enum(["bca", "bni", "bri", "cimb"])
  }),
  item_details : itemDetailsSchema
});

export const walletTransactionSchema = z.object({
  payment_type: paymentTypeEnum,
  transaction_details: transactionDetailsSchema,
  item_details : itemDetailsSchema
});

export const transactionSchema = z.object({
  payment_type: paymentTypeEnum,
  transaction_details: transactionDetailsSchema,
  bank_transfer: z.object({
    bank: z.enum(["bca", "bni", "bri", "cimb"])
  }).optional(),
});


export type iTransactionSchema = z.infer<typeof transactionSchema>;
export type iVaTransaction = z.infer<typeof vaTransactionSchema>;
export type iWalletTransaction = z.infer<typeof walletTransactionSchema>;




export type iTransaction = z.infer<typeof transactionSchema>;


