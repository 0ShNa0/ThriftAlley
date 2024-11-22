import { Router } from "express";
import { removeFromCart, addToCart } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.route("/removeFromCart/:userId/:productId").patch(removeFromCart);
cartRouter.route("/addToCart/:userId/:productId").patch(addToCart);

export { cartRouter };
