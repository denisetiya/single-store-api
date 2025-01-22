import { Router } from "express";
import auth from "./module/auth/auth.controller";
import product from "./module/product/product.controller";
import cart from "./module/cart/cart.controller";
import order from "./module/order/order.controller";
import review from "./module/review/review.controller";


const url: Router = Router();

url.use("/", auth);
url.use("/", product);
url.use("/", cart);
url.use("/", order);
url.use("/", review);

export default url