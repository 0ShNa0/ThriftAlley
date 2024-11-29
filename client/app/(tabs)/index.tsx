import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import HomeScreenDisplay from '../homescreen';

interface Product {
  _id: string;
  name: string;
  garmentType: string;
  price: number;
  colour: string;
  size: string;
  images: string[];
  quantity: number;
}

const HomeWindow = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSellerProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'http://localhost:8000/api/v1/products/searchProducts',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('There are no active products in your store right now');
        }

        const data = await response.json();
        setProducts(data.message);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProducts();
  }, []); // No need for accessToken, fetch products on component mount

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.header}>Thrift Alley</Text>
          <Text style={styles.subHeader}>Where style meets savings</Text>
        </View>
        <TextInput
          style={styles.searchBar}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      {loading ? (
  <ActivityIndicator size="large" color="#4CAF50" />
) : error ? (
  <Text style={styles.error}>{error}</Text>
) : filteredProducts.length === 0 ? (
  <View style={styles.emptyStateContainer}>
    <Text style={styles.emptyStateText}>
      No products match your search query. Try searching for something else!
    </Text>
  </View>
) : (
  <HomeScreenDisplay products={filteredProducts} />
)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row', // Align items in a row
    justifyContent: 'space-between', // Ensure space between left (text) and right (search bar)
    alignItems: 'center', // Vertically align items
    marginBottom: 20, // Add space below the header
    marginLeft : 30
  },
  headerTextContainer: {
    flexDirection: 'column', // Stack texts vertically
    justifyContent: 'center', // Center the text vertically
  },
  searchBar: {
    height: 42, // Increase height for better touch target
    borderColor: '#4CAF50', // Green border to make it stand out
    borderWidth: 2, // Slightly thicker border
    borderRadius: 25, // Rounded corners for a smoother look
    paddingHorizontal: 15, // More space inside the input
    width: '28%', // Increase width of the search bar
    backgroundColor: '#ffffff', // White background
    shadowColor: '#000000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.3, // Slight opacity for shadow
    shadowRadius: 5, // Softer shadow radius
    marginRight: 61,
  },
  header: {
    fontSize: 47,
    fontWeight: 'bold',
    color: '#4CAF50',
    textShadowColor: '#bbb',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  subHeader: {
    fontSize: 24,
    fontWeight: '300',
    color: '#757575',
    marginTop: 5,
  },
  error: {
    color: '#B00020',
    textAlign: 'center',
    fontSize: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  
});

export default HomeWindow;
