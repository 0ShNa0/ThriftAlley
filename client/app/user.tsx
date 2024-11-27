import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
interface UserBarProps {
  onLogin: (loggedIn: boolean, name: string, accessToken: string) => void;
}

const UserBar: React.FC<UserBarProps> = ({ onLogin }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // true for login, false for register
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });
  const [errors, setErrors] = useState({ email: '', password: '', fullName: '' });
  const [infoMessage, setInfoMessage] = useState('');


const validateFields = () => {
  const newErrors = { email: '', password: '', fullName: '' };
  
  if (!formData.email.trim()) newErrors.email = 'Email is required';
  if (!formData.password.trim()) newErrors.password = 'Password is required';
  if (!isLogin && !formData.fullName.trim()) newErrors.fullName = 'Full Name is required';

  setErrors(newErrors);

  // Return false if there are any errors
  return !Object.values(newErrors).some(error => error);
};
  
const handleSubmit = () => {
  if (validateFields()) {
    isLogin ? handleLogin() : handleRegister();
  }
};

const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, password: formData.password }),
    });
    if (response.ok) {
      const result = await response.json();
      setLoggedIn(true);
      setUsername(result.data.name);
      setAccessToken(result.data.accessToken);
      onLogin(true, result.data.name, result.data.accessToken);
      setModalVisible(false);
      setInfoMessage(''); // Clear any previous messages
    } else if (response.status === 401) {
      setErrors({ ...errors, password: 'Invalid password' });
      setInfoMessage('Invalid password. Please try again.');
    } else if (response.status === 404) {
      setErrors({ ...errors, email: "User doesn't exist" });
      setInfoMessage("User doesn't exist. Please register.");
    } else {
      setInfoMessage('Login failed. Please try again.');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    setInfoMessage('An error occurred during login.');
  }
};


  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        }),
      });
      if (response.ok) {
        setInfoMessage('Registration successful! Please log in.');
        setTimeout(() => setIsLogin(true), 2000);
      } else if (response.status === 409) {
        setInfoMessage('User already registered! Please log in.');
        setTimeout(() => setIsLogin(true), 2000);
      } else {
        setInfoMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setInfoMessage('An error occurred during registration.');
    }
  };
  
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setInfoMessage(''); // Clear any previous messages
    setErrors({ email: '', password: '', fullName: '' });

  };
  

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // Add the token here
        },
      });
      if (response.ok) {
        setLoggedIn(false);
        setUsername('');
        onLogin(false, '', ''); // Notify parent about logout
        console.log('Logged out successfully');
      } else {
        alert('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.userBarContainer}>
      {loggedIn ? (
        <View style={styles.loggedInContainer}>
          <Text style={styles.username}>Welcome, {username}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.authButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setIsLogin(true);
              setModalVisible(true);
            }}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setIsLogin(false);
              setModalVisible(true);
            }}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      )}

<Modal
  visible={modalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => {
    setModalVisible(false);
    setErrors({ email: '', password: '', fullName: '' });
    setFormData({ email: '', password: '', fullName: '' });
    {infoMessage && (
      <Text style={{ color: 'red', marginVertical: 10, textAlign: 'center' }}>
        {infoMessage}
      </Text>
    )}
    
  }}
>

  <View style={styles.modalContainer}>
    <Text style={styles.modalTitle}>
      {isLogin ? 'Login' : 'Register'}
    </Text>
    {!isLogin && (
      <>
        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
        />
        {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
      </>
    )}
    <TextInput
  placeholder="Email"
  value={formData.email}
  onChangeText={(value) => handleInputChange('email', value)}
  style={styles.input}
  keyboardType="email-address"
/>
{errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
<TextInput
  placeholder="Password"
  value={formData.password}
  onChangeText={(value) => handleInputChange('password', value)}
  style={styles.input}
  secureTextEntry
/>

    {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.actionButton, styles.primaryButton]}
        onPress={handleSubmit} // Calls handleSubmit instead of handleLogin/handleRegister
      >
        <Text style={styles.buttonTextLr}>{isLogin ? 'Login' : 'Register'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
  style={[styles.actionButton, styles.cancelButton]}
  onPress={() => {
    setModalVisible(false);
    setErrors({ email: '', password: '', fullName: '' });
    setFormData({ email: '', password: '', fullName: '' });
  }}
>
  <Text style={styles.buttonTextLr}>Cancel</Text>
</TouchableOpacity>

    </View>
  </View>
</Modal>

    </View>
    
  );
};

const styles = StyleSheet.create({
  userBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#4CAF50',
    marginBottom: 11,
  },
  loggedInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1, // Ensure it spans the width of the container
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 'auto',
  },
  logoutButton: {
    backgroundColor: 'white',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 'auto'
  },
  logoutButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  authButtons: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: 400, // Medium size for the input fields
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: 280, // Increased width to make buttons larger
  },
  actionButton: {
    flex: 1,
    alignItems: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically
    paddingVertical: 12, // Increased vertical padding for larger buttons
    borderRadius: 10, // Rounded edges for buttons
    marginHorizontal: 5, // Space between the buttons
  },
  primaryButton: {
    backgroundColor: '#4CAF50', // Green color for primary action
  },
  cancelButton: {
    backgroundColor: 'red', // Red color for cancel action
  },
  buttonTextLr: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16, // Slightly larger font size
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
  },
  
});

export default UserBar;
