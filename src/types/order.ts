import { z } from "zod";

const paymentSchema = z.object({
  method: z
  .enum(["bank_transfer", "credit_card", "gopay"])
  .refine(
    (value) => ["bank_transfer", "gopay"].includes(value),
    {
      message: "Invalid payment type: sorry we not support this payment type",
    }
  ),
  type: z.enum(["bca", "bni", "bri", "cimb"]),
  amount: z.number(),
});

const addOrderSchema = z
  .object({
    userId: z.string(),
    customerEmail: z.string().email("Invalid email format"),
    customerName: z.string(),
    productId: z.string(),
    productPrice: z.number().positive("Product price must be greater than 0"),
    quantity: z.number(),
  })
  .extend({
    payment: paymentSchema,
  });

type iAddOrder = z.infer<typeof addOrderSchema>;

export { addOrderSchema };
export type { iAddOrder };
