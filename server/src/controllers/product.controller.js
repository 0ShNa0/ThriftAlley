import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addProduct = asyncHandler(async (req, res) => {
  const { name, garmentType, price, colour, size, quantity } = req.body;
  const { userId } = req.params;
  console.log(req.body);
  if (!name || !garmentType || !price || !colour || !size || !quantity) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No files uploaded. Please upload images.");
  }

  const imageUrls = [];
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newPath = await uploadOnCloudinary(path);
    if (newPath) {
      imageUrls.push(newPath.secure_url);
    } else {
      throw new ApiError(500, "Error uploading image to Cloudinary");
    }
  }

  const newProduct = await Product.create({
    name,
    garmentType,
    seller: userId,
    price,
    colour,
    size,
    images: imageUrls,
    quantity,
    isSold: false,
  });

  console.log("user is", user.fullName);
  try {
    await newProduct.save();
    user.listedClothes.push(newProduct._id);
    await user.save();
    console.log("Product saved:", newProduct);
    ApiResponse(201, newProduct, "Product saved successfully");
  } catch (error) {
    console.error("Error saving product:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

const getSellerProducts = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    ApiError(404,"User not found");
  }
  const products = await Product.find({ seller: userId });
  if (!products || products.length === 0) {
    ApiError(404,"No clothes found for this user");
  }
  res.status(200).json({message:"Listed clothes found",data:products});
});

const searchProducts=asyncHandler(async(req,res)=>{
const products= await Product.find({});
 if(!products)
 {
  throw new ApiError(400,"No products found");
 }
 res.status(200).json({
  success: true,
  message: "Products retrieved successfully",
  data: products
});
});

export { addProduct, getSellerProducts ,searchProducts };
