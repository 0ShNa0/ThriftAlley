import { Router } from "express";
import { removeFromCart, addToCart } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.route("/removeFromCart/:cartId/:productId").patch(removeFromCart);
cartRouter.route("/addToCart/:userId/:productId").patch(addToCart);

export { cartRouter };
