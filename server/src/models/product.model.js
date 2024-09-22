import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    garmentType: {
      type: String,
      required: true,
      enum: [
        "shirt",
        "pants",
        "shorts",
        "jeans",
        "trousers",
        "dress",
        "Top",
        "T-shirt",
        "leggings",
        "kurta",
        "pyjama",
        "lehenga",
        "saree",
        "anarkali",
        "jacket",
        "blazer",
        "coat",
        "scarf",
        "muffler",
        "gloves",
        "dhoti",
        "socks",
      ],
      index: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    colour: {
      type: String,
      required: true,
      enum: [
        "red",
        "yellow",
        "white",
        "blue",
        "green",
        "pink",
        "purple",
        "brown",
        "black",
        "golden",
        "silver",
        "lilac",
      ],
      index: true,
    },
    isSold: {
      type: Boolean,
      required: true,
    },
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL"],
      required: true,
      index: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.plugin("mongooseAggregatePaginate");

export const Product = mongoose.model("Product", productSchema);
