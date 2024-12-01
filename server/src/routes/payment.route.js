import { Router } from "express";
import { performPayment } from "../controllers/payment.controller.js";

const paymentRouter = Router();

paymentRouter.route("/pay").post(verifyToken, performPayment);

export { paymentRouter };
