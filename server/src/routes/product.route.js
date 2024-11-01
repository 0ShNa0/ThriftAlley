import { Router } from "express";
import {
  addProduct,
  getSellerProducts,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const productRouter = Router();

productRouter.route("/addForSelling/:userId").post(upload.array("images", 3), addProduct);
productRouter.route("/getSellerProducts/:userId").get(getSellerProducts);


export { productRouter };
