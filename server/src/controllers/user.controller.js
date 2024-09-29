import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(req.body);
  if (
    [fullName, email, password].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log(existingUser);
    throw new ApiError(409, "User with given email exists");
  }
  const user = await User.create({
    fullName,
    email,
    password,
  });

  res.status(201).json({ message: "User registered successfully!", user });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(409, "User with given email doesn't exist");
  }

  res.status(201).json({ message: "User logged in successfully!" });
});

export { registerUser, loginUser };
