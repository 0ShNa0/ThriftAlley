import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

type NewItem = {
  title: string;
  price: string;
  garmentType: string;
  colour: string;
  size: string;
  quantity: string;
  images: any[]; // Array of image URIs
};

interface AddSellerButtonProps {
  accessToken: string;
}

const AddSellerButton: React.FC<AddSellerButtonProps> = ({ accessToken }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState<NewItem>({
    title: "",
    price: "",
    garmentType: "",
    colour: "",
    size: "",
    quantity: "1",
    images: [],
  });

  // Handle input changes
  const handleInputChange = (field: keyof NewItem, value: string) => {
    setNewItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle Image Selection
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setNewItem((prev) => ({
        ...prev,
        images: [...prev.images, result.assets[0].uri],
      }));
    }
  };

  // Submit the data to the API
  const submitData = async () => {
    const formData = new FormData();
    formData.append("name", newItem.title);
    formData.append("garmentType", newItem.garmentType);
    formData.append("price", newItem.price);
    formData.append("colour", newItem.colour);
    formData.append("size", newItem.size);
    formData.append("quantity", newItem.quantity);

    // Append images as Blobs
    for (let i = 0; i < newItem.images.length; i++) {
      try {
        const response = await fetch(newItem.images[i]); // Fetch the image from URI
        const blob = await response.blob(); // Convert to Blob

        formData.append("images", blob, `image${i}.jpg`); // Append the Blob to formData
      } catch (error) {
        console.error("Failed to fetch and append image:", error);
      }
    }

    // Send the data to the backend
    try {
      const response = await axios.post('http://localhost:8000/api/v1/products/addForSelling', formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Item added successfully:', response.data);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Add Item Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Item</Text>
      </TouchableOpacity>

      {/* Add Item Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Item</Text>

            <ScrollView style={styles.scrollView}>
              {/* Title Input */}
              <TextInput
                placeholder="Item Title"
                style={styles.input}
                value={newItem.title}
                onChangeText={(text) => handleInputChange("title", text)}
              />

              {/* Price Input */}
              <TextInput
                placeholder="Price"
                style={styles.input}
                value={newItem.price}
                onChangeText={(text) => handleInputChange("price", text)}
                keyboardType="numeric"
              />

              {/* Garment Type Picker */}
              <Picker
                selectedValue={newItem.garmentType}
                style={styles.picker}
                onValueChange={(itemValue) => handleInputChange("garmentType", itemValue)}
              >
                <Picker.Item label="Select Garment Type" value="" />
                <Picker.Item label="Dress" value="dress" />
                <Picker.Item label="Shirt" value="shirt" />
                <Picker.Item label="Pants" value="pants" />
                <Picker.Item label="T-Shirt" value="t-shirt" />
              </Picker>

              {/* Colour Picker */}
              <Picker
                selectedValue={newItem.colour}
                style={styles.picker}
                onValueChange={(itemValue) => handleInputChange("colour", itemValue)}
              >
                <Picker.Item label="Select Colour" value="" />
                <Picker.Item label="Black" value="black" />
                <Picker.Item label="Red" value="red" />
              </Picker>

              {/* Size Picker */}
              <Picker
                selectedValue={newItem.size}
                style={styles.picker}
                onValueChange={(itemValue) => handleInputChange("size", itemValue)}
              >
                <Picker.Item label="Select Size" value="" />
                <Picker.Item label="S" value="S" />
                <Picker.Item label="M" value="M" />
                <Picker.Item label="L" value="L" />
              </Picker>

              {/* Quantity Input */}
              <TextInput
                placeholder="Quantity"
                style={styles.input}
                value={newItem.quantity}
                onChangeText={(text) => handleInputChange("quantity", text)}
                keyboardType="numeric"
              />

              {/* Image Upload Button */}
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadButtonText}>Pick Images</Text>
              </TouchableOpacity>

              {/* Image Upload List */}
              {newItem.images.length > 0 && (
                <View>
                  <Text>Selected Images:</Text>
                  {newItem.images.map((uri, index) => (
                    <Text key={index}>{uri}</Text>
                  ))}
                </View>
              )}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={submitData}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: { color: 'white', fontSize: 16 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
    width: '85%',
    maxHeight: '90%',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  scrollView: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
    width: '100%',
  },
  picker: { width: '100%', marginBottom: 12 },
  uploadButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButtonText: { color: 'white' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: {
    backgroundColor: '#FF5722',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: { color: 'white' },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: { color: 'white' },
});

export default AddSellerButton;
