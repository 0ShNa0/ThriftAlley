import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { Cart } from "../models/cart.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addToCart = asyncHandler(async (req, res) => {
  const { productId, userId } = req.params;
  const { quantity } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const addingProduct = await Product.findById(productId);
  if (!addingProduct) {
    throw new ApiError(404, "Product not found");
  }

  if (
    !user?.cart &&
    addingProduct?.isSold === false &&
    addingProduct?.quantity >= quantity
  ) {
    const yourCart = await new Cart({
      user: userId,
      products: {
        product: productId,
        quantity: quantity,
      },
      totalamount: addingProduct?.price * quantity,
    });

    if (!user.cart) {
      user.cart = yourCart._id; 
    } else {
      console.error("User already has a cart associated.");
    }
    
  
    try {
      await yourCart.save(); 
      console.log("Cart saved successfully:", yourCart);
    } catch (error) {
      console.error("Error saving the cart:", error);
    }
  } 
  else if (
    user?.cart &&
    addingProduct?.isSold === false &&
    addingProduct?.quantity >= quantity
  ) {
    const yourCart = user?.cart;
    const existingProduct = yourCart.products.find(
      (prod) => prod.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      yourCart.products.push({ product: productId, quantity });
    }
    user.cart = yourCart._id;
   

    try {
      await yourCart.save(); 
      console.log("Cart saved successfully:", yourCart);
    } catch (error) {
      console.error("Error saving the cart:", error);
    }
  }
  try {
  
    await user.save();
     const isCart=await user?.cart;
    ApiResponse(201,isCart, "Product saved successfully");
  } catch (error) {
    console.log(error);
    throw new ApiError(404, "Invalid product or cart conditions.");
  }
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { productId, cartId } = req.params;
  const yourCart = await Cart.find({ cartId });
  if (!yourCart) {
    throw ApiError(404, "Cart not found");
  }
  const product = yourCart.products.find(
    (prod) => prod.product.toString() === productId
  );
});

export { addToCart, removeFromCart };
