import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addProduct = asyncHandler(async (req, res) => {
  const { name, garmentType, price, colour, size, quantity } =
    req.body;
    const { userId } = req.params;
    console.log(req.body);
  if (
    !name ||
    !garmentType ||
    !price ||
    !colour ||
    !size ||
    !quantity
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded. Please upload images." });
  }

  const urls = [];
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newPath = await uploadOnCloudinary(path);
    urls.push(newPath);
  }

  const newProduct = await Product.create({
    name,
    garmentType,
    seller:userId,
    price,
    colour,
    size,
    images:urls.map( url => url.res ),
    quantity,
    isSold:false
  });

  console.log("user is",user.fullName);
  try {
    await newProduct.save();
    user.listedClothes.push(newProduct._id);
    await user.save();
    console.log('Product saved:', newProduct); 
    return res.status(201).json({
      message: "Product saved successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error saving product:", error); 
    throw new ApiError(500, "Internal Server Error");
  }
});

const getSellerProducts=asyncHandler(async (req,res)=>{
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const products = await Product.find({ seller: userId });
  if(!products || products.length === 0)
    { return res.status(404).json({ message: 'No clothes found for this user' });
}
return res.status(200).json({
  message: 'Listed clothes found',
  data: products,
});
});


export { addProduct,getSellerProducts };
