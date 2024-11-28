import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import HomeScreenDisplay from '../homescreen';
import UserBar from '../user';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Callback to handle login
  const handleLogin = (loggedIn: boolean, name: string) => {
    setIsLoggedIn(loggedIn);
    setUsername(name);
  };

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

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <UserBar onLogin={handleLogin} />
      <View style={styles.headerContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <View style={styles.headerWrapper}>
          <Text style={styles.header}>Thrift Alley</Text>
          <Text style={styles.subHeader}>Where style meets savings</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
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
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    flex: 1,
  },
  headerWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 20,
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    textShadowColor: '#bbb',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '300',
    color: '#757575',
    marginTop: 5,
  },
  infoContainer: {
    marginTop: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#B00020',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default HomeWindow;
