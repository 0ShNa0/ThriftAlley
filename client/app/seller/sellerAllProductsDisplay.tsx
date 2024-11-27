import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';

type Product = {
  _id: string;
  name: string;
  garmentType: string;
  price: number;
  colour: string;
  size: string;
  images: string[];
};

type Props = {
  products: Product[];
};

const SellerProductsDisplay = ({ products }: Props) => {
  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDetails}>
        {item.garmentType} | {item.size} | {item.colour}
      </Text>
      <Text style={styles.productPrice}>${item.price}</Text>
    </View>
  );

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item._id}
      renderItem={renderProduct}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default SellerProductsDisplay;
