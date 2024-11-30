import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Product = {
  _id: string;
  name: string;
  garmentType: string;
  price: number;
  colour: string;
  size: string;
  images: string[];
  quantity: number;
};

type Props = {
  products: Product[];
};

const HomeScreenDisplay = ({ products }: Props) => {
  const [imageIndices, setImageIndices] = useState<{ [key: string]: number }>({});
  const [numColumns] = useState(3); // Set the number of columns once

  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [cart, setCart] = useState<any | null>(null);

  // Fetch the access token when the component mounts
  useEffect(() => {
    const getAccessToken = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Retrieved Token:', token);
      if (token) {
        setAccessToken(token);
      } else {
        // If token is not found, handle accordingly (e.g., redirect to login)
        console.log('No access token found');
      }
    };

    getAccessToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchCart();
    }
  }, [accessToken]);

  // Function to handle next image click
  const goToNextImage = (productId: string, currentIndex: number, imagesLength: number) => {
    if (currentIndex < imagesLength - 1) {
      setImageIndices({
        ...imageIndices,
        [productId]: currentIndex + 1,
      });
    }
  };

  // Function to handle previous image click
  const goToPreviousImage = (productId: string, currentIndex: number) => {
    if (currentIndex > 0) {
      setImageIndices({
        ...imageIndices,
        [productId]: currentIndex - 1,
      });
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/v1/cart/fetchCart', 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCart(response.data.cart);  // Update the local cart state
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };
 
  
  const addToCart = async (productId: string, quantity: number) => {
    if (!accessToken) {
      console.log('No access token available');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/v1/cart/addToCart/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert(response.data.message);
      fetchCart(); // Fetch the updated cart after adding the item
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  // const updateCart = (cart: any) => {
  //   setCart(cart.products);
  // };

  // const addToCart = async (productId: string, quantity: number) => {
  //   if (!accessToken) {
  //     console.log('No access token available');
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {
  //     const response = await axios.patch(
  //       `http://localhost:8000/api/v1/cart/addToCart/${productId}`,
  //       { quantity },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`, // Send the access token in the header
  //         },
  //       }
  //     );
  //     console.log(response.data);
  //     alert(response.data.message);
  //     updateCart(response.data.data);
  //   } catch (error) {
  //     console.error('Error adding to cart:', error);
  //     alert('Failed to add item to cart');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };



  // Render each product
  const renderProduct = ({ item }: { item: Product }) => {
    const currentImageIndex = imageIndices[item._id] || 0;

    return (
      <View style={styles.productCard}>
        <View style={styles.imageContainer}>
          {currentImageIndex > 0 && (
            <TouchableOpacity
              onPress={() => goToPreviousImage(item._id, currentImageIndex)}
              style={[styles.arrowButton, styles.leftArrow]}>
              <MaterialIcons name="chevron-left" size={30} color="#ffffff" />
            </TouchableOpacity>
          )}
          <Image source={{ uri: item.images[currentImageIndex] }} style={styles.productImage} />
          {currentImageIndex < item.images.length - 1 && (
            <TouchableOpacity
              onPress={() => goToNextImage(item._id, currentImageIndex, item.images.length)}
              style={[styles.arrowButton, styles.rightArrow]}>
              <MaterialIcons name="chevron-right" size={30} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDetails}>
          {item.garmentType} | {item.size} | {item.colour}
        </Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
        <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
        <TouchableOpacity
          style={[styles.addToCartButton, isLoading && { backgroundColor: '#aaa' }]} // Change button style when loading
          onPress={() => addToCart(item._id, 1)} // Pass the product ID and quantity
          disabled={isLoading} // Disable the button when loading
        >
          <Text style={styles.addToCartButtonText}>
            {isLoading ? 'Adding...' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={products}
      key={numColumns} // Force FlatList to re-render if numColumns changes
      keyExtractor={(item) => item._id}
      renderItem={renderProduct}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6, // Slightly smaller padding for the button
    paddingHorizontal: 16, // Adjusted width
    borderRadius: 20, // More rounded corners for the button
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    alignSelf: 'center', // Center the button horizontally
    marginBottom: 15, // Add space from the bottom
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '30%',
    margin: '1.5%',
    height: 400, // Adjust card height for larger images
  },
  imageContainer: {
    flex: 1, // Ensure the image container takes available space
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: '90%', // Take most of the container's width
    height: '80%', // Occupy a large portion of the card height
    borderRadius: 8,
    resizeMode: 'contain', // Ensure the entire image is visible
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent black
    padding: 10,
    borderRadius: 50,
  },
  leftArrow: {
    left: 5,
    transform: [{ translateY: -15 }],
  },
  rightArrow: {
    right: 5,
    transform: [{ translateY: -15 }],
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  productDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 5,
  },
  productQuantity: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },


});


export default HomeScreenDisplay;
