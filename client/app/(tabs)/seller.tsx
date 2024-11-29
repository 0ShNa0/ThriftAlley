import UserBar from '../user';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import SellerProductsDisplay from '../seller/sellerAllProductsDisplay';

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
const SellerWindow = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false); // Default to false to avoid spinner at start
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Callback to handle login
  const handleLogin = (loggedIn: boolean, name: string, token: string) => {
    console.log('in handlelogic');
    setIsLoggedIn(loggedIn);
    setUsername(name);
    setAccessToken(token);
    console.log('access token - '+ token);
  };

  useEffect(() => {
    const fetchSellerProducts = async () => {
      if (!accessToken){
        console.log('no access token');
        return;
      }

      setLoading(true); // Start loading when fetch starts
      try {
        
        const response = await fetch(
          'http://localhost:8000/api/v1/products/getSellerProducts',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`, // Pass the token
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('There are no active products here your store right now');
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
        setLoading(false); // Stop loading after fetch
      }
    };

    fetchSellerProducts();
  }, [accessToken]); // Trigger fetch only when accessToken changes

  return (
    <View style={styles.container}>
      <UserBar onLogin={handleLogin} />
      <Text style={styles.header}>Seller Dashboard</Text>

      
      {!isLoggedIn ? (
        <Text style={styles.info}>Please log in to view your products.</Text>
      ) : loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <SellerProductsDisplay 
  products={products} 
  setProducts={setProducts} // Pass setProducts as a prop
  accessToken={accessToken || ''} // Pass accessToken as a prop (ensure it's not null or undefined)
/>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SellerWindow;
