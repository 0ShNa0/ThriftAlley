import React, { useState, useEffect } from "react";
import { FlatList, Text, View, TouchableOpacity, ActivityIndicator, Alert, Image, StyleSheet, ScrollView, TextInput } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
//import { useNavigation,NavigationProp } from '@react-navigation/native';


import { useRouter,useNavigation } from "expo-router";

const CartScreen: React.FC = () => {
  const router = useRouter();
  const [cart, setCart] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [accessToken, setAccessToken] = useState('');
  const [disabledProducts, setDisabledProducts] = useState<any>({});
  
 
  //const hardcodedtoken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzRiZDllMzcwMjZkY2RlOWMwOWZjYzEiLCJpYXQiOjE3MzMwMjYzNDEsImV4cCI6MTczMzExMjc0MX0.JXkEnk4lnwR2qTuAWpJ985VCZZTZ4hfedqhdiSsXezk"
 
  useEffect(() => {
    const getAccessToken = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Retrieved Token:', token);
      if (token) {
        setAccessToken(token);
      } else {
       
        console.log('No access token found');
      }
    };

    getAccessToken();
  }, []);
  
  // //wait for access token to be set

  useEffect(() => {
    if (accessToken) {
      fetchCart();
    }
  }, [accessToken]);


  const fetchCart = async () => {
    try {
      
      const response = await axios.get("http://localhost:8000/api/v1/cart/fetchCart", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCart(response.data.data || response.data);
    } catch (err: any) {
      Alert.alert("Error", `Failed to fetch cart data: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: string, action: "increase" | "decrease") => {
    const quantityUpdate = action === "increase" ? 1 : -1;
    console.log('Updating quantity for product:', productId);
    console.log('Quantity Update:', quantityUpdate);

    // Update the cart locally
    const updatedProducts = cart!.products.map((item: any) => {
      if (item.product._id === productId) {
        const newQuantity = item.quantity + quantityUpdate;
        if (newQuantity >= 1) {
          return { ...item, quantity: newQuantity };
        } else {
          return null; 
        }
      }
      return item;
    }).filter((item: any) => item !== null);

    const updatedTotalAmount = updatedProducts.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    );
    setCart({ ...cart!, products: updatedProducts, totalAmount: updatedTotalAmount });

    try {
      if (quantityUpdate > 0) {
        // Increasing quantity
        await axios.patch(
          `http://localhost:8000/api/v1/cart/addToCart/${productId}`,
          { quantity: quantityUpdate },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      } else {
        // Decreasing quantity
        await axios.patch(
          `http://localhost:8000/api/v1/cart/removeFromCart/${productId}`,
          { quantity: Math.abs(quantityUpdate) },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        console.error("Error updating quantity:", err.response?.data?.message || "Unknown error");

        // Disable "+" button if the limit is reached
        setDisabledProducts((prev: any) => ({ ...prev, [productId]: true }));

        // Alert user about the issue
        Alert.alert("Limit Reached", err.response?.data?.message || "No more items available.");
      } else {
        console.error("Unexpected error:", err);
        Alert.alert("Error", "Failed to update product quantity on the server.");
      }
    }
  };


  
  const handleRemoveFromCart = async (productId: string) => {
    try {
     
      if (!cart || !cart.products) {
        Alert.alert("Error", "Cart is empty or not available.");
        return;
      }
  
      await axios.patch(
        `http://localhost:8000/api/v1/cart/removeFromCart/${productId}`,
        {}, //remove item completely
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
  
      // Filter the product to remove it from the cart
      const updatedProducts = cart.products.filter((item: { product: { _id: string; }; }) => item.product._id !== productId);
  
      // Update the cart state with the updated product list and total amount
      const updatedTotalAmount = updatedProducts.reduce(
        (sum: number, item: {
          quantity: number; product: { price: number }; 
}) => {
          // Ensure valid numbers before performing arithmetic
          const price = item.product.price || 0;
          const quantity = item.quantity || 0;
          return sum + (price * quantity);
        },
        0
      );
  
      // Ensure totalAmount is not NaN or undefined
      if (isNaN(updatedTotalAmount)) {
        throw new Error("Invalid total amount");
      }
  
      setCart((prevCart: any) => {
        return { ...prevCart, products: updatedProducts, totalAmount: updatedTotalAmount };
      });
    } catch (err: any) {
      Alert.alert("Error", `Failed to remove item from cart: ${err.message || err}`);
    }
  };
  

  //   // Apply coupon
  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "save10") {
      setDiscount(10); 
      Alert.alert("Success", "Coupon applied: 10% discount!");
    } else {
      setDiscount(0);
      Alert.alert("Error", "Invalid coupon code.");
    }
  };

  const handleProceedToCheckout = () => {
    // Navigate to the Payment screen using the router.push method
    if (!cart || cart.length === 0) {
      Alert.alert("Your cart is empty.");
      return;
    }
    /*router.push({
      pathname: '../../payment.tsx',
      params: { totalAmount: cart.totalAmount }, // Passing the total amount to the Payment screen
    });
    */
    router.push(`/payment?totalAmount=${cart.totalAmount}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingCartContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading your cart...</Text>
      </View>
    );
  }

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <View style={styles.emptyCartContainer}>
        <Text>Your cart is empty!</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.logo}>ThriftAlley</Text>
        <View style={styles.icons}>
          <TouchableOpacity>
            <Text style={styles.icon}>🛒</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.icon}>👤</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.icon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cart Layout */}
      <View style={styles.cartContainer}>
        {/* Left Side: Cart Items */}
        <View style={styles.cartItemsContainer}>
          <Text style={styles.title}>Shopping Bag</Text>

          <FlatList
            data={cart.products}
            keyExtractor={(item) => item.product._id}
            ListHeaderComponent={
              <>
                <View style={styles.headerRow}>
                  <Text style={[styles.headerText, { flex: 2.5 }]}>Product</Text>
                  <Text style={[styles.headerText, { flex: 1 }]}>Price</Text>
                  <Text style={[styles.headerText, { flex: 1 }]}>Quantity</Text>
                  <Text style={[styles.headerText, { flex: 1 }]}>Total Price</Text>
                </View>
                <View style={styles.divider} />
              </>
            }
            renderItem={({ item }) => (
              <>
                <View style={styles.productRow}>
                  {/* Product Details */}
                  <View style={styles.productDetailsContainer}>
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: item.product.images[0] }} style={styles.productImage} />

                    </View>
                    <View>
                      <Text style={styles.productName}>{item.product.name}</Text>
                      <Text style={styles.productInfo}>{item.product.colour}</Text>
                      <Text style={styles.productInfo}>Size:{item.product.size}</Text>
                    </View>
                  </View>

                  {/* Price */}
                  <Text style={[styles.detailText, { flex: 1 }]}>
                    Rs. {item.product.price.toFixed(2)}
                  </Text>

                  {/* Quantity Controls */}
                  <View style={[styles.quantityControls, { flex: 1 }]}>
                  <TouchableOpacity onPress={() => handleUpdateQuantity(item.product._id, "decrease")}>
                      <Ionicons
                        name="remove-circle-outline"
                        size={20}
                        color="#333"
                      />
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text>
                    {/* "+" Button */}
                    <TouchableOpacity
                      onPress={() => handleUpdateQuantity(item.product._id, "increase")}
                      disabled={item.quantity == item.product.quantity || disabledProducts[item.product._id]}
                    >


                      <Ionicons
                        name="add-circle-outline"
                        size={20}
                        color={item.quantity >= item.product.quantity ? '#CCC' : '#333'}
                      />
                    </TouchableOpacity>
                  </View>

                  
                  <Text style={[styles.detailText, { flex: 1 }]}>
                    Rs. {(item.product.price * item.quantity).toFixed(2)}
                  </Text>

                  <TouchableOpacity onPress={() => handleRemoveFromCart(item.product._id)}>
                    <Ionicons name="trash-outline" size={20} color="red" />
                  </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.divider} />
              </>
            )}
          />
        </View>

        {/* Right Side: Order Details */}
        <View style={styles.orderDetailsContainer}>
          <Text style={styles.sectionTitle}>Calculated Shipping</Text>


          <Text style={styles.sectionTitle}>Coupon Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Coupon Code"
            value={couponCode}
            onChangeText={setCouponCode}
          />
          <TouchableOpacity style={styles.button} onPress={applyCoupon}>
            <Text style={styles.buttonText}>Apply</Text>
          </TouchableOpacity>


          <Text style={styles.totalText}>Discount: {discount}%</Text>
          <Text style={styles.totalText}>Total: Rs. {cart.totalAmount}</Text>


          <TouchableOpacity style={styles.checkoutButton} onPress={handleProceedToCheckout}>
            <Text style={styles.buttonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  totalContainer: {
    marginBottom: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 20 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },

  cartContainer: { flexDirection: "row", justifyContent: "space-between" },
  detailText: { marginLeft: 10, fontSize: 14, textAlign: "center" },
  //productDetailsContainer: { flexDirection: "row", flex: 2 },
  //imageContainer: { width: 60, height: 80, backgroundColor: "#e0e0e0" },
  quantityControls: {
    flexDirection: "row", alignItems: "center", justifyContent: 'center'
  },
  quantity: { textAlign: "center", width: 30 },
  divider: { height: 1, backgroundColor: "#e0e0e0", marginVertical: 15 },

  logo: { fontSize: 20, fontWeight: "bold", color: "#333" },
  icons: { flexDirection: "row", alignItems: "center" },
  icon: { fontSize: 24, marginLeft: 20, color: "#333" },

  cartItemsContainer: {
    flex: 2,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    padding: 20,
    marginRight: 10,
  },
  orderDetailsContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#333" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", paddingBottom: 5 },
  headerText: { fontSize: 14, fontWeight: "600", color: "#555", paddingLeft: 5 },
  productRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  productDetailsContainer: { flexDirection: "row", alignItems: "center", flex: 2 },
  imageContainer: {
    width: 60,
    height: 80,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  imageText: { color: "#999", fontSize: 12 },
  productName: { fontSize: 16, fontWeight: "600", color: "#333" },
  productInfo: { fontSize: 12, color: "#555", marginVertical: 2 },

  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    color: "#333",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  cartTotalContainer: { marginTop: 20 },
  totalRow: { fontSize: 16, marginVertical: 5, color: "#333" },
  finalTotal: { fontSize: 18, fontWeight: "bold", marginTop: 10, color: "#007BFF" },
  checkoutButton: {
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  checkoutButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  loadingCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },


  // Empty Cart Styles
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },


});

export default CartScreen;

















// app/cart.tsx
// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { useRouter } from 'expo-router';

// const Cart = () => {
//   const router = useRouter();

//   const handlePayment = () => {
//     router.push('/Payment'); // Navigates to the Payment screen
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Your Cart</Text>
//       <Text style={styles.message}>Items: 3</Text>
//       <Button title="Proceed to Payment" onPress={handlePayment} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   message: {
//     fontSize: 18,
//     marginBottom: 20,
//   },
// });

// export default Cart;
