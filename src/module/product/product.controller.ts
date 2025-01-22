import { Router, Request, Response } from "express";
import response from "../../utils/response.api";
import ProductService from "./product.service";
import { iGetProduct, iProduct, iUpdateProduct } from "../../types/product";
import { productSchema, getProductSchema } from "../../types/product";
import { configureCloudinary, upload,compressAndUploadImage,compressAndUploadMultipleImages } from "../../utils/upload.handler";
import handleValidationError from "../../utils/validation.handler";

const product: Router = Router();

configureCloudinary();


product.get("/products", async (req: Request, res: Response) => {


    const productData: iGetProduct = Object.fromEntries(
        Object.entries(req.query).map(([key, value]) => {
            switch (key) {
                case "name":
                case "category":
                    return [key, value as string];
                case "priceMin":
                case "priceMax":
                    return [key, Number(value)];
                case "discount":
                    return [key, Boolean(value)];
                default:
                    return [];
            }
        })
    ) as iGetProduct;

    const validateData = getProductSchema.safeParse(productData);

    if (!validateData.success) {
        return handleValidationError(validateData, res);
    }

    try {
        const product = await ProductService.getProduct(productData);
        return response(res, 200, "Success", null, product);
    } catch (error :any) {
        return response(res, error.status || 400, "Error Getting Product", error.message);
    }
});


product.get("/product/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const product = await ProductService.getProduct({id : id});
        return response(res, 200, "Success", null, product);
    } catch (error :any) {
        return response(res, error.status || 400, "Error Getting Product", error.message);
    }
});

product.post("/product",upload.single('image'), async (req: Request, res: Response) => {

    if (!req.file) {
        return response(res, 400, "Bad Request", "need image product");
      }
    
      try {

        const image = await compressAndUploadImage(req.file.buffer, "products");

        const productData : iProduct = {
            ...req.body,
            price : Number(req.body.price),
            image : image,
            stock : Number(req.body.stock),
            discount : Number(req.body.discount)
        }

        const validateData = productSchema.safeParse(productData);

        if (!validateData.success) {
            return handleValidationError(validateData, res);
        }

        const newProduct = await ProductService.createProduct(productData);

        return response(res, 200, "Success", null, newProduct);

    } catch (error :any) {
        return response(res, error.status || 400, "Error add new Product", error.message);
    }
})


product.put("/product/:id", upload.single('image'), async (req: Request, res: Response) => {
    const id = req.params.id;

    const productData: iUpdateProduct = {};
    if (!req.file) {


        if (req.body.name) productData.name = req.body.name as string;
        if (req.body.category) productData.category = req.body.category;
        if (req.body.description) productData.description = req.body.description as string;
        if (req.body.price) productData.price = typeof req.body.price === 'string' ? Number(req.body.price) : req.body.price;
        if (req.body.stock) productData.stock = typeof req.body.stock === 'string' ? Number(req.body.stock) : req.body.stock;
        if (req.body.discount) productData.discount = typeof req.body.discount === 'string' ? Number(req.body.discount) : req.body.discount;
        
    
    } else {

        const image = await compressAndUploadImage(req.file.buffer, "products");

        if (req.body.name) productData.name = req.body.name as string;
        if (req.body.category) productData.category = req.body.category;
        if (req.body.description) productData.description = req.body.description as string;
        if (req.body.price) productData.price = Number(req.body.price);
        if (image) productData.image = image
        if (req.body.stock) productData.stock = Number(req.body.stock);
        if (req.body.discount) productData.discount = Number(req.body.discount);
   
    }

    try {
        const product = await ProductService.updateProduct(id as string, productData);
        return response(res, 200, "Success", null, product);
    } catch (error :any) {
        return response(res, error.status || 400, "Error Updating Product", error.message);
    }
})


product.delete("/product/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const product = await ProductService.deleteProduct(id as string);
        return response(res, 200, "Success", null, product);
    } catch (error :any) {
        return response(res, error.status || 400, "Error Deleting Product", error.message);
    }
})



export default product