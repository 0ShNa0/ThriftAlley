import Stripe from "stripe";
import { asyncHandler } from "../utils/asyncHandler";

const stripe = new Stripe("sk_test_tR3PYbcVNZZ796tH88S4VQ2u");

const performPayment = asyncHandler(async (re, res) => {});

export { performPayment };
