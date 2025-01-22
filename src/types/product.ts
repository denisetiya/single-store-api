

import {z} from "zod";

const getProductSchema = z.object({
    id : z.string().optional(),
    name : z.string().min(3, "Name must be at least 3 characters long").optional(),
    priceMin : z.number().min(1, "Price must be at least 1").optional(),
    priceMax : z.number().min(1, "Price must be at least 1").optional(),
    category : z.string().min(3, "Category must be at least 3 characters long").optional(),
    discount : z.boolean().optional(),
})

const productSchema = z.object({
    name : z.string().min(3, "Name must be at least 3 characters long"),
    description : z.string().min(4, "Description must be at least 4 characters long"),
    price : z.number().min(1, "Price must be at least 1"),
    category : z.enum(['Indoor', 'OutDoor', 'Living Room', 'Kitchen', 'Bedroom', 'Office']).refine((val) => {
    const categories = ['Indoor', 'OutDoor', 'Living Room', 'Kitchen', 'Bedroom', 'Office'];
        return categories.includes(val);
    }),
    image : z.string(),
    stock : z.number().min(1, "Stock must be at least 1"),
    discount : z.number().min(0.1, "Discount must be at least 0.1").optional()
})


const updateProductSchema = z.object({
    name : z.string().min(3, "Name must be at least 3 characters long").optional(),
    description : z.string().min(4, "Description must be at least 4 characters long").optional(),
    price : z.number().min(1, "Price must be at least 1").optional(),
    category : z.enum(['Indoor', 'OutDoor', 'Living Room', 'Kitchen', 'Bedroom', 'Office']).refine((val) => {
    const categories = ['Indoor', 'OutDoor', 'Living Room', 'Kitchen', 'Bedroom', 'Office'];
        return categories.includes(val);
    }).optional(),
    image : z.string().optional(),
    stock : z.number().min(1, "Stock must be at least 1").optional(),
    discount : z.number().min(1, "Discount must be at least 1").optional()
})

type iGetProduct = z.infer<typeof getProductSchema>
type iProduct = z.infer<typeof productSchema>
type iUpdateProduct = z.infer<typeof updateProductSchema>

export {getProductSchema, productSchema}
export type {iGetProduct, iProduct, iUpdateProduct}