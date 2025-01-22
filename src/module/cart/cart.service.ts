import prisma from "../../config/prisma.config";
import isError from "../../utils/error.handler";
import { iAddCart } from "../../types/cart";



export default class CartService {
    static async getCart( userId : string) {
        try {
            const cart = await prisma.user.findMany({
                where : {
                    id : userId
                },
                select : {
                    carts : {
                        select : {
                            id : true,
                            quantity : true,
                            productId : true,
                            product : {
                                select : {
                                    id : true,
                                    name : true,
                                    category : true,
                                    price : true,
                                    stock : true,
                                    discount : true
                                }
                            }
                        }
                    }
                }
            })
            return cart
        } catch (error: unknown) {
            console.log(error)
            isError(error)
        }        
    }

    static async addCart(cartData : iAddCart) {


        try {
            const cartAvailable = await prisma.cartUser.findUnique({
                where: {
                    userId : cartData.userId,
                }
            });

            if (cartAvailable) {
                const newQuantity = cartAvailable.quantity + cartData.quantity;
                if (newQuantity > 0) {
                    const cart = await prisma.cartUser.update({
                        where: {
                            id: cartAvailable.id
                        },
                        data: {
                            quantity: newQuantity
                        }
                    });
                    return cart;
                } else {
                    const cart = await prisma.cartUser.delete({
                        where: {
                            id: cartAvailable.id
                        }
                    });
                    return cart;
                }
            } else {
                if (cartData.quantity > 0) {
                const cart = await prisma.cartUser.create({
                    data: cartData
                });
                return cart;
                } else {
                    return {
                        error : "Amount must be greater than 0"
                    }
                }
            }

        } catch (error: unknown) {
            console.log(error)
            isError(error)
        }   

    }

    static async deleteCart(id : string) {
        try {
            const cart = await prisma.cartUser.delete({
                where : {
                    id : id
                }
            })
            return cart
        } catch (error: unknown) {
            console.log(error)
            isError(error)
        }   
    }
    

}