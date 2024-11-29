// cart.model.ts
export interface CartProduct {
    product: {
      _id: string; // Product ID reference
      name: string; // Product name
      price: number; // Product price
    };
    quantity: number;
  }
  
  export interface Cart {
    _id: string; // User ID reference
    products: CartProduct[]; // Array of cart products
    totalAmount: number; // Total cost of products in the cart
    updatedAt: Date; // When the cart was last updated
  }
// user.model.ts
export interface User {
    _id: string; // User ID
    fullName: string; // User's full name
    email: string; // User's email
    password: string; // User's password (hashed)
    purchases: string[]; // Array of Product IDs that the user has purchased
    orders: string[]; // Array of Order IDs related to this user
    payments: string[]; // Array of Payment IDs associated with this user
    cart: string; // Cart ID reference (Cart document associated with this user)
  }
    
  // export interface Product {
  //   _id: string; // Product ID reference
  //   name: string; // Product name
  //   price: number; // Product price
  //   images: string[]; // Array of image URLs
  //   colour: string; // Product color
  //   size: string; // Product size
  // }
  // export interface Product {
  //   _id: string; // Product ID
  //   name: string; // Product name
  //   garmentType: string; // Garment type (enum values)
  //   seller: string; // Seller ID reference
  //   price: number; // Price of the product
  //   colour: string; // Product color (enum values)
  //   isSold: boolean; // Whether the product is sold
  //   size: "XS" | "S" | "M" | "L" | "XL"; // Product size (enum values)
  //   images: string[]; // Array of image URLs
  //   quantity: number; // Available quantity
  //   createdAt: Date; // Creation timestamp (provided by Mongoose)
  //   updatedAt: Date; // Update timestamp (provided by Mongoose)
  // }
  