import prisma from "../../config/prisma.config";
import isError from "../../utils/error.handler";
import { iGetProduct, iProduct, iUpdateProduct } from "../../types/product";
import { deleteImageMulter } from "../../utils/upload.handler";

export default class ProductService {

    static async getProduct(productData : iGetProduct) {

        try {
           if (productData.id) {
                const product = await prisma.product.findUnique({
                    where : {
                        id : productData.id
                    }
                })
                return product
            }
            else if (productData.name) {
                const product = await prisma.product.findMany({
                    where: {
                        name: {
                            contains: productData.name,
                            mode: 'insensitive'
                        }
                    }
                })
                return product
            } else if (productData.category) {
                const product = await prisma.product.findMany({
                    where: {
                        category: productData.category
                }
                })
                return product
            } else if (productData.priceMin && productData.priceMax) {
                const product = await prisma.product.findMany({
                    where: {
                        price: {
                            gte: productData.priceMin,
                            lte: productData.priceMax
                        }
                    }
                })
                return product
            } else if (productData.discount) {
                const product = await prisma.product.findMany({
                    where: {
                        discount: {
                            gt: 0.1
                        },
                    },
                    orderBy: {
                        discount: 'desc'
                    }
                })
                return product
            } else {
                const product = await prisma.product.findMany()
                return product
            }


        } catch (error) {
            console.log(error)
            isError(error)
        }

    }


    static async createProduct(productData : iProduct) {

        try {
            const product = await prisma.product.create({
                data : productData
            })
            return product
        } catch (error) {
            console.log(error)
            isError(error)
        }
    }


    static async updateProduct(id : string, productData : iUpdateProduct) {

        try {
            const product = await prisma.product.update({
                where : {
                    id : id
                },
                data : productData
            })


            return product
        } catch (error) {
            console.log(error)
            isError(error)
        }
    }

    static async deleteProduct(id : string) {

        try {
            const product = await prisma.product.delete({
                where : {
                    id : id
                }
            })
            if (product) {
                 await deleteImageMulter(product.image)

                return product
            }
            return product
        } catch (error) {
            console.log(error)
            isError(error)
        }
    }
}