import { Router } from "express";
import {
  removeFromCart,
  addToCart,
  fetchCart,
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.route("/removeFromCart/:userId/:productId").patch(removeFromCart);
cartRouter.route("/addToCart/:userId/:productId").patch(addToCart);
cartRouter.route("/fetchCart/:userId").get(fetchCart);
export { cartRouter };
