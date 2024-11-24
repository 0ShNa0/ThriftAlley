import { Router } from "express";
import {
  addProduct,
  getSellerProducts,
  incrementProduct,
  decrementProduct,
  searchProducts,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const productRouter = Router();

productRouter
  .route("/addForSelling")
  .post(upload.array("images", 3), addProduct);
productRouter.route("/getSellerProducts").get(getSellerProducts);
productRouter.route("/searchProducts").get(searchProducts);
productRouter.route("/incrementProduct/:productId").patch(incrementProduct);
productRouter.route("/decrementProduct/:productId").patch(decrementProduct);
export { productRouter };
