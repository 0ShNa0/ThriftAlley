import { Router } from "express";
import {
  removeFromCart,
  addToCart,
  fetchCart,
} from "../controllers/cart.controller.js";
import { verifyJWT
 } from "../middlewares/auth.middleware.js";

const cartRouter = Router();

cartRouter.use(verifyJWT);
cartRouter.route("/removeFromCart/:productId").patch(removeFromCart);
cartRouter.route("/addToCart/:productId").patch(addToCart);
cartRouter.route("/fetchCart").get(fetchCart);
export { cartRouter };
