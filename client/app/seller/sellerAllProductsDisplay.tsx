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
};

const SellerProductsDisplay = ({ products }: Props) => {
  const [imageIndices, setImageIndices] = useState<{ [key: string]: number }>({});
  const [numColumns] = useState(3); // Set the number of columns once

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


export default SellerProductsDisplay;
