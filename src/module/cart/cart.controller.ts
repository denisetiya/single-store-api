import { Router, Request, Response } from "express";
import { addCartSchema, iAddCart } from "../../types/cart";
import CartService from "./cart.service";
import response from "../../utils/response.api";
import handleValidationError from "../../utils/validation.handler";

const cart: Router = Router();

cart.post("/cart/:userId", async (req: Request, res: Response) => {
    const cartData : iAddCart = {
        ...req.body,
        userId : req.params.userId
    } 
        

    const validateData = addCartSchema.safeParse(cartData);

    if (!validateData.success) {
        
        return handleValidationError(validateData, res);
    }

    try {
        const cart : any = await CartService.addCart(cartData);

        if (cart?.error) {
            return response(res, 400, "Error", cart?.error);
        }
        return response(res, 200, "Success", null, cart);

    } catch (error: any) {
        return response(res, error.status || 400, error.message);
    }
});


cart.get("/cart/:userId", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const cart = await CartService.getCart(userId as string);
        return response(res, 200, "Success", null, cart);

    } catch (error: any) {
        return response(res, error.status || 400, error.message);
    }
});

cart.delete("/cart/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const cart = await CartService.deleteCart(id as string);
        return response(res, 200, "Success", null, cart);
    } catch (error: any) {
        return response(res, error.status || 400, error.message);
    }
});


export default cart