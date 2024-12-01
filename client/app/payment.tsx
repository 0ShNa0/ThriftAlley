
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const Payment = () => {
  const router = useRouter();
  const { totalAmount } = useLocalSearchParams(); // Retrieve totalAmount from route params

  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false); // Control animation visibility
  const [isPaymentComplete, setIsPaymentComplete] = useState(false); 

  const handlePayNow = () => {
    setIsPaymentProcessing(true);

    // Simulate payment processing delay
    setTimeout(() => {
      setIsPaymentProcessing(false);
      setIsPaymentComplete(true);
    }, 3000); // Animation lasts for 3 seconds
  };

  const handleGoBack = () => {
    router.push('/cart'); // Navigate back to the Cart screen
  };

  const generateInvoice = async () => {
    try {
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
              .content { margin-top: 20px; font-size: 18px; }
              .footer { margin-top: 40px; text-align: center; font-size: 14px; color: gray; }
            </style>
          </head>
          <body>
            <div class="header">Payment Invoice</div>
            <div class="content">
              <p>Payment Successful!</p>
              <p><strong>Total Amount: Rs. ${totalAmount}</strong></p>
              <p>Payment ID: #${Math.floor(Math.random() * 1000000)}</p>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="footer">Thank you for your purchase!</div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log('Invoice generated at:', uri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Error', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      Alert.alert('Error', 'Failed to generate the invoice.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {isPaymentProcessing ? (
          // Payment processing animation
          <LottieView
            source={require('@/assets/Animation - 1732948365966.json')} // Lottie success animation
            autoPlay
            loop={false}
            style={styles.lottie}
          />
        ) : isPaymentComplete ? (
          // Payment success message
          <>
            <Text style={styles.header}>Payment Successful!</Text>
            <Text style={styles.message}>
              Your payment has been processed successfully.
            </Text>
            <Text style={styles.totalAmount}>Total Amount: Rs. {totalAmount}</Text>
            <TouchableOpacity style={styles.greenButton} onPress={generateInvoice}>
              <Text style={styles.buttonText}>Download Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.greenButton, styles.buttonSpacing]} onPress={handleGoBack}>
              <Text style={styles.buttonText}>Back to Cart</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Initial "Pay Now" button
          <>
            <Text style={styles.header}>Ready to Pay?</Text>
            <Text style={styles.message}>
              Your total amount is Rs.{totalAmount}.
            </Text>
            <TouchableOpacity style={styles.greenButton} onPress={handlePayNow}>
              <Text style={styles.buttonText}>Pay Now</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9', // Softer background
  },
  card: {
    width: '90%',
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 5 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 10, 
    elevation: 10, 
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#34495e',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 20,
    textAlign: 'center',
  },
  greenButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 25,
    alignItems: 'center',
    width: '50%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonSpacing: {
    marginTop: 15,
  },
  lottie: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});


export default Payment;
