import prisma from "../../config/prisma.config";
import isError from "../../utils/error.handler";
import { iAddOrder } from "../../types/order";
import { iVaTransaction, iWalletTransaction } from "../../types/payment";
import paymentService from "./payment";
import coreApi from "../../utils/midtrans.client";

export default class OrderService {
  static async addOrder(orderData: iAddOrder) {
    try {
      const order = await prisma.order.create({
        data: {
          userId: orderData.userId,
          productId: orderData.productId,
          quantity: orderData.quantity,
          payment: {
            create: {
              method: orderData.payment.method,
              amount: orderData.payment.amount,
              type: orderData.payment.type,             
            },
          },
        },
      });

      if (order) {
        if (orderData.payment.method === "bank_transfer") {
              const vaData: iVaTransaction = {
                bank_transfer: {
                  bank : orderData.payment.type,
                },
                payment_type: "bank_transfer",
                transaction_details: {
                  order_id: `order-${new Date().getTime()}`, 
                  gross_amount: orderData.quantity * orderData.productPrice,
                },
                item_details: {
                  id : orderData.userId,
                  price : orderData.productPrice,
                  quantity : orderData.quantity,
                  name : orderData.customerName,
                  merchant_name: orderData.productId,
                },
              };
              const payment = await paymentService.createVATransaction(vaData);

              if (payment) {
                await prisma.paymentHistory.update({
                  where: {
                    orderId: order.id,
                  },
                  data: {
                    vaNumber: payment.va_numbers,
                    midtransId: payment.order_id,                    
                  },

                });
              }
              return {
                ...order,
                ...payment,
              };
          } else if (orderData.payment.method === "gopay") {
              const walletData: iWalletTransaction = {
                payment_type: "gopay",
                transaction_details: {
                  order_id: `order-${new Date().getTime()}`, 
                  gross_amount: orderData.quantity * orderData.productPrice,
                },
                item_details: {
                  id : orderData.userId,
                  price : orderData.productPrice,
                  quantity : orderData.quantity,
                  name : orderData.customerName,
                  merchant_name: orderData.productId,
                },
              };
              const payment = await paymentService.createWalletTransaction(walletData);
              
              
              if (payment) {
                await prisma.paymentHistory.update({
                  where: {
                    orderId: order.id,
                  },
                  data: {
                    linkQr: {
                      name : payment.payment_type,
                      url : payment.actions 
                    },
                    midtransId: payment.order_id,                    
                  },

                });
              }

              return {
                ...order,
                ...payment,
              };
          }
      }
    } catch (error) {
      console.log(error);
      isError(error);
    }
  }

  static async getStatusTransaction(id: string) {

    console.log("ni id nya ",id)
    try {

      const payment = await prisma.paymentHistory.findUnique({
        where: {
          midtransId: id,
        }
      });

      const paymentMidtrans  = await coreApi.transaction.status(id);

      if (paymentMidtrans.transaction_status != payment?.status) {
        await prisma.paymentHistory.update({
          where: {
            midtransId: id,
          },
          data: {
            status: paymentMidtrans.transaction_status,
          },
        });
      }

      if (paymentMidtrans.transaction_status === "settlement") {
        const order = await prisma.order.update({
          where: {
            id: payment?.orderId,
          },
          data: {
            delivery: {
              create: {
                status: "packing",
                trackingNumber:  String(Math.floor(Math.random() * 100000000) + 1),
                estimatedDelivery: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
                history: [
                  {
                    status: "packing",
                    date : new Date(),
                  }
                ]
              }
            }
          },
        });

        await prisma.product.update({
          where: {
            id: order.productId,
          },
          data: {
            sold: {
              increment: order.quantity
            },
            stock: {
              decrement: order.quantity
            }
          },
        })
      }

      const data = {
        orderId : payment?.orderId,
        method : payment?.method,
        amount: payment?.amount,
        currency : paymentMidtrans?.currency,
        vaNumber: payment?.vaNumber,
        linkQr: payment?.linkQr,
        status : paymentMidtrans.transaction_status,
        paymentType : paymentMidtrans.payment_type,
        time : paymentMidtrans.transaction_time,
      }
      
      return data

    } catch (error) {
      console.log(error);
      isError(error);
    }
  }

  static async getOrder(userId: string) {
    try {
      const order = await prisma.order.findMany({
        where: {
          userId: userId,
        },
        include: {
          product: true,
          payment: true,
          delivery: true,
        },
      });
      return order;
    } catch (error) {
      console.log(error);
      isError(error);
    }
  }

  static async getAllOrder() {
    try {
      const order = await prisma.order.findMany({
        include: {
          product: true,
          payment: true,
          delivery: true,
        },
      });
      return order;
    } catch (error) {
      console.log(error);
      isError(error);
    }
  }

  static async deleteOrder(id: string) {
    try {
      const order = await prisma.order.update({
        where: { id },
        data: {
          payment: {
            update: {
              where: {
                orderId: id,
              },
              data: {
                status: "cancelled",
              },
            },
          },
        },
      });
      return order;
    } catch (error) {
      console.log(error);
      isError(error);
    }
  }
}