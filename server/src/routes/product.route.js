import { Router } from "express";
import {
  addProduct,
  getSellerProducts,
  incrementProduct,
  decrementProduct,
  searchProducts,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const productRouter = Router();

productRouter
  .route("/addForSelling")
  .post(verifyJWT,upload.array("images", 3),addProduct);
productRouter.route("/getSellerProducts").get(verifyJWT, getSellerProducts);
productRouter.route("/searchProducts").get(searchProducts);
productRouter
  .route("/incrementProduct/:productId")
  .patch(verifyJWT, incrementProduct);
productRouter
  .route("/decrementProduct/:productId")
  .patch(verifyJWT, decrementProduct);
export { productRouter };
