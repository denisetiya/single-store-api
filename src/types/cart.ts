import {z} from "zod";

const addCartSchema = z.object({
    userId : z.string(),
    productId : z.string(),
    quantity : z.number()
})



type iAddCart = z.infer<typeof addCartSchema>



export {addCartSchema}
export type {iAddCart}
