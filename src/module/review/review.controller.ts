import { Router, Request, Response } from "express";
import response from "../../utils/response.api";
import ReviewService from "./review.service";
import { iAddReview, iUpdateReview } from "../../types/review";
import { addReviewSchema, updateReviewSchema } from "../../types/review";
import handleValidationError from "../../utils/validation.handler";
import { configureCloudinary, upload, compressAndUploadImage } from "../../utils/upload.handler";

const review: Router = Router();

configureCloudinary();

review.post("/review/:userId", upload.single("image"), async (req: Request, res: Response) => {

    let reviewData : iAddReview;
    if (!req.file) {
        reviewData  = {
            ...req.body,
            rating : Number(req.body.rating),
            userId : req.params.userId
        }
      }

    else {
         
        const image = await compressAndUploadImage(req.file.buffer, "reviews");

        reviewData =  {
            ...req.body,
            userId : req.params.userId,
            rating : Number(req.body.rating),
            image : image
        }
    }

    const validateData = addReviewSchema.safeParse(reviewData);

    if (!validateData.success) {
        return handleValidationError(validateData, res);
    }

    try {
        const review = await ReviewService.addReview(reviewData);
        return response(res, 200, "Success", review);

    } catch (error: any) {
        return response(res, error.status || 400, error.message);
    }
});


review.delete("/review/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const review = await ReviewService.deleteReview(id as string);
        return response(res, 200, "Success", null, review);
    } catch (error :any) {
        return response(res, error.status || 400, "Error Deleting Review", error.message);
    }
})


review.get("/review/:productId", async (req: Request, res: Response) => {
    const productId = req.params.productId;
    try {
        const review = await ReviewService.getReview(productId as string);
        return response(res, 200, "Success", null, review);
    } catch (error :any) {
        return response(res, error.status || 400, "Error Getting Review", error.message);
    }
})

review.put("/review/:id", upload.single("image"), async (req: Request, res: Response) => {
    const id = req.params.id;

    let reviewData : iUpdateReview = {
        reviewId: id as string
    }
    let image : string | null = null;

    if (req.file) {
        image = await compressAndUploadImage(req.file.buffer, "reviews");
    }
    if (req.body.rating) {reviewData.rating = Number(req.body.rating)}
    if (req.body.comment) {reviewData.comment = req.body.comment}
    if (image) {reviewData.image = image}

    const validateData = updateReviewSchema.safeParse(reviewData);

    if (!validateData.success) {
        return handleValidationError(validateData, res);
    }


    try {
        const review = await ReviewService.updateReview(reviewData);
        return response(res, 200, "Success", null, review);
    
    } catch (error :any) {
        return response(res, error.status || 400, "Error Updating Review", error.message);
    }
})




export default review