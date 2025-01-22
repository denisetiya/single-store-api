import { Router, Request, Response } from "express";
import response from "../../utils/response.api";
import OrderService from "./order.service";
import { iAddOrder} from "../../types/order";
import { addOrderSchema} from "../../types/order";
import handleValidationError from "../../utils/validation.handler";

const order: Router = Router();

order.post("/order/:userId", async (req: Request, res: Response) => {
    const orderData : iAddOrder = {
        userId : req.params.userId,
        ...req.body
    }

    const validateData = addOrderSchema.safeParse(orderData);
    
    if (!validateData.success) {
        return handleValidationError(validateData, res);
    }

    try {
        const order = await OrderService.addOrder(orderData);
        return response(res, 200, "Success", null, order);

    } catch (error: any) {
        return response(res, error.status || 400, error.message);
    }
});


order.get("/order/:userId", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const order = await OrderService.getOrder(userId as string);
        return response(res, 200, "Success", null, order);
    } catch (error :any) {
        return response(res, error.status || 400, "Error Getting Order", error.message);
    }
})

order.get("/order/status/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const order = await OrderService.getStatusTransaction(id as string);
        return response(res, 200, "Success", null, order);
    } catch (error :any) {
        return response(res, error.status || 400, "Error Getting Order", error.message);
    }
    
})

order.get("/orders", async (req: Request, res: Response) => {
    try {
        const order = await OrderService.getAllOrder();
        return response(res, 200, "Success", null, order);
    } catch (error :any) {
        return response(res, error.status || 400, "Error Getting Order", error.message);
    }
    
})

order.delete("/order/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const order = await OrderService.deleteOrder(id as string);
        return response(res, 200, "Success", null, order);
    } catch (error :any) {
        return response(res, error.status || 400, "Error Deleting Order", error.message);
    }
})

export default order