import React, { useState } from 'react';
import { View, Button, Text, Image, StyleSheet } from 'react-native';
import Constants from 'expo-constants';  // Import Constants from expo
import RazorpayCheckout from 'react-native-razorpay';

const PaymentScreen = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const amount = 1000;

  // Access Razorpay key from Constants.manifest.extra
  const razorpayTestKey = Constants.expoConfig?.extra?.razorpayKey;
  if (!razorpayTestKey) {
    console.error('Razorpay Key is missing!');
  }

  // Assuming you fetched this `order_id` from your backend
  const orderId = "order_id_from_backend"; // Replace with actual order ID

  const handlePayment = () => {
    const options = {
      description: 'Thank you for your purchase',
      image: 'https://maigha.com/wp-content/uploads/2023/10/Untitled_design-2-removebg-preview.png',
      currency: 'INR',
      key: razorpayTestKey,  // Use the key from Constants
      amount: amount * 100,
      name: 'Maigha Inc',
      order_id: orderId,  // Add the order_id here
      prefill: {
        email: 'support@maigha.com',
        phone: '9888626111',
        name: 'Hrushikesh Vetagiri',
        address: {
          city: 'Nellore',
          state: 'Andhra Pradesh',
          country: 'India',
          zip: '524137',
        },
      },
      theme: { color: '#09518e' },
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        console.log(`Payment successful: ${data.razorpay_payment_id}`);
        setPaymentSuccess(true);
      })
      .catch((error) => {
        console.log('Payment error:', error.description, error.code);
      });
  };

  return (
    <View style={styles.container}>
      {paymentSuccess ? (
        <View style={styles.paymentContainer}>
          <Image
            source={{
              uri: 'https://maigha.com/wp-content/uploads/2023/10/Untitled_design-2-removebg-preview.png',
            }}
            style={styles.image}
          />
          <Text style={styles.description}>Thank you for your purchase!</Text>
          <Text style={styles.amount}>Amount: {amount} INR</Text>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Pay Now" onPress={handlePayment} color="#09518e" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: 200,
    height: 50,
    borderRadius: 10,
    fontSize: 18,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 150,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
  },
  amount: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default PaymentScreen;
