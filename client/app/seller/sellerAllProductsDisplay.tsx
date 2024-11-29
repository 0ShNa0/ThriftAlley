// SellerProductsDisplay.tsx

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>; // New prop to update products
  accessToken: string; // Add accessToken prop for API authentication
};

const SellerProductsDisplay = ({ products, setProducts, accessToken }: Props) => {
  const [imageIndices, setImageIndices] = useState<{ [key: string]: number }>({});
  const [numColumns] = useState(3);

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

  // Function to call API for incrementing product quantity
  const incrementQuantity = async (productId: string, currentQuantity: number) => {
    console.log('increment curr quantity - ' + currentQuantity);
    console.log("json body below");
    console.log(JSON.stringify({
      quantity: currentQuantity + 1, // Increment quantity by 1
    }));
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/products/incrementProduct/${productId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Add Authorization header
          },
          body: JSON.stringify({
            quantity: 1, // Increment quantity by 1
          }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to increment quantity');
      }

      // Update the frontend state after the API call
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      );
    } catch (error) {
      console.error('Error incrementing quantity:', error);
    }
  };

  // Function to call API for decrementing product quantity
  const decrementQuantity = async (productId: string, currentQuantity: number) => {
    console.log('decrement - ' + currentQuantity);
    if (currentQuantity <= 0) return; // Prevent decrementing below 0

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/products/decrementProduct/${productId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Add Authorization header
          },
          body: JSON.stringify({
            quantity: 1, // Decrement quantity by 1
          }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to decrement quantity');
      }

      // Update the frontend state after the API call
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, quantity: product.quantity - 1 }
            : product
        )
      );
    } catch (error) {
      console.error('Error decrementing quantity:', error);
    }
  };

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

        {/* Quantity Display and Controls */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => decrementQuantity(item._id, item.quantity)}>
            <MaterialIcons name="remove" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => incrementQuantity(item._id, item.quantity)}>
            <MaterialIcons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
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
    height: 450, // Adjusted card height for larger images and quantity controls
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: '90%',
    height: '80%',
    borderRadius: 8,
    resizeMode: 'contain',
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SellerProductsDisplay;
