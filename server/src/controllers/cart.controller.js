import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { Cart } from "../models/cart.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const addToCart = asyncHandler(async (req, res) => {
  const { productId, userId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than 0");
  }

  const user = await User.findById(userId).populate("cart");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const addingProduct = await Product.findById(productId);
  if (!addingProduct) {
    throw new ApiError(404, "Product not found");
  }

  if (addingProduct.isSold || addingProduct.quantity < Number(quantity)) {
    throw new ApiError(400, "Product is not available in the desired quantity");
  }

  const addToTotal = Number(addingProduct.price) * Number(quantity);
  let cart;

  if (!user.cart) {
    cart = new Cart({
      user: userId,
      products: [],
      totalAmount: 0,
    });
    user.cart = cart._id;
  } else {
    cart = await Cart.findById(user.cart._id);
  }

  const existingProduct = cart.products.find(
    (prod) => prod.product.toString() === productId
  );

  if (existingProduct) {
    const maxAddableQuantity =
      addingProduct.quantity - existingProduct.quantity;
    existingProduct.quantity =
      Number(existingProduct.quantity) + Number(quantity);

    if (quantity > maxAddableQuantity) {
      throw new ApiError(
        400,
        `Only ${maxAddableQuantity} more items available for this product`
      );
    }
  } else {
    cart.products.push({ product: productId, quantity: Number(quantity) });
  }

  cart.totalAmount += addToTotal;

  try {
    await cart.save();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      message: "Product added to cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error saving the cart:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { productId, userId } = req.params;
  const { quantity } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const yourCart = await Cart.findById(user?.cart._id);
  if (!yourCart) {
    throw new ApiError(404, "Cart not found");
  }

  const productIndex = yourCart.products.findIndex(
    (item) => item.product._id.toString() === productId
  );
  const productInCart = yourCart.products[productIndex];
  const isProduct = await Product.findById(productId);
  if (Number(quantity) > productInCart.quantity) {
    throw new ApiError(400, "quantity exceeds cart allocation");
  }
  if (Number(quantity) < productInCart.quantity) {
    productInCart.quantity -= Number(quantity);
    yourCart.totalAmount -= Number(quantity) * isProduct.price;
  } else {
    yourCart.totalAmount -= productInCart.quantity * isProduct.price;
    yourCart.products.splice(productIndex, 1);
  }

  try {
    if (yourCart.products.length === 0) {
      await Cart.findByIdAndDelete(yourCart._id);
      await User.updateOne({ _id: userId }, { $unset: { cart: "" } });
      res.status(200).json({
        message: "Cart is empty and has been deleted.",
      });
    } else {
      await yourCart.save();
      res.status(200).json({
        message: "Cart updated successfully",
        data: yourCart,
      });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

const fetchCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const yourCart = await Cart.findById(user?.cart._id);
  if (!yourCart) {
    throw new ApiError(404, "Cart not found");
  }
  try {
    res.status(200).json({
      message: "Cart fetched successfully",
      data: yourCart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

export { addToCart, removeFromCart, fetchCart };
