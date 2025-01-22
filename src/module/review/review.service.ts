import prisma from "../../config/prisma.config";
import isError from "../../utils/error.handler";
import { iAddReview, iUpdateReview } from "../../types/review";


export default class ReviewService {
    static async addReview(reviewData : iAddReview) {
        try {
            const review = await prisma.review.create({
                data : reviewData
            })
            return review
        } catch (error) {
            console.log(error)
            isError(error)
        }
    }

    static async deleteReview(id : string) {
        try {
            const review = await prisma.review.delete({
                where : {
                    id : id
                }
            })
            return review
        } catch (error) {
            console.log(error)
            isError(error)
        }
    }

    static async getReview(productId : string) {
        try {
            const review = await prisma.review.findMany({
                where : {
                    productId : productId
                }
            })
            return review
        } catch (error) {
            console.log(error)
            isError(error)
        }
    }

    static async updateReview(reviewData : iUpdateReview) {
        try {
            const { reviewId, ...data } = reviewData;
            const review = await prisma.review.update({
                where: {
                    id: reviewId
                },
                data
            })
            return review
        } catch (error) {
            console.log(error)
            isError(error)
        }
    }

}