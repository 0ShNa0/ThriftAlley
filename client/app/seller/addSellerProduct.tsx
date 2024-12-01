import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

type NewItem = {
  title: string;
  price: string;
  garmentType: string;
  colour: string;
  size: string;
  quantity: string;
  images: string[]; // Array of image URIs
};

interface AddSellerButtonProps {
  accessToken: string;
}

const AddSellerButton: React.FC<AddSellerButtonProps> = ({ accessToken }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState<NewItem>({
    title: "",
    price: "",
    garmentType: "",
    colour: "",
    size: "",
    quantity: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
  
    if (!newItem.title) newErrors.title = "Title is required.";
    if (!newItem.price) newErrors.price = "Price is required.";
    if (!newItem.garmentType) newErrors.garmentType = "Garment type is required.";
    if (!newItem.colour) newErrors.colour = "Colour is required.";
    if (!newItem.size) newErrors.size = "Size is required.";
    if (!newItem.quantity) newErrors.quantity = "Quantity is required.";
    if (newItem.images.length === 0) newErrors.images = "At least one image is required.";
    if (newItem.images.length > 3) newErrors.images = "Maximum 3 images allowed.";
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  
  

  const handleInputChange = (field: keyof NewItem, value: string) => {
    setNewItem((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear the error for the specific field
    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[field];
      return updatedErrors;
    });
  };
  

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
  
      // Clear the error related to images once an image is picked
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.images;  // Remove the image error
        return updatedErrors;
      });
    }
  };
  

  const submitData = async () => {
    if (!validateInputs()) return; // Stop if there are validation errors
    setLoading(true);
    const formData = new FormData();
    formData.append("name", newItem.title);
    formData.append("garmentType", newItem.garmentType);
    formData.append("price", newItem.price);
    formData.append("colour", newItem.colour);
    formData.append("size", newItem.size);
    formData.append("quantity", newItem.quantity);

    for (let i = 0; i < newItem.images.length; i++) {
      try {
        const response = await fetch(newItem.images[i]);
        const blob = await response.blob();
        formData.append("images", blob, `image${i}.jpg`);
      } catch (error) {
        console.error("Error appending image:", error);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/products/addForSelling",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Item added successfully:", response.data);
      setModalVisible(false);
      setNewItem({
        title: "",
        price: "",
        garmentType: "",
        colour: "",
        size: "",
        quantity: "1",
        images: [],
      });
    
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Item</Text>
      </TouchableOpacity>

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
            <TextInput
  placeholder="Item Title"
  style={[styles.input, errors.title ? styles.errorInput : null]}
  value={newItem.title}
  onChangeText={(text) => handleInputChange("title", text)}
/>
{errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
              <TextInput
                placeholder="Price"
                style={[styles.input, errors.price ? styles.errorInput : null]}
                value={newItem.price}
                onChangeText={(text) => handleInputChange("price", text)}
                keyboardType="numeric"
              />
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

              <Picker
  selectedValue={newItem.garmentType}
  style={[styles.picker, errors.garmentType ? styles.errorPicker : null]}
  onValueChange={(value) => handleInputChange("garmentType", value)}
>
                <Picker.Item label="Select Garment Type" value="" />
                <Picker.Item label="Anarkali" value="anarkali" />
                <Picker.Item label="Blazer" value="blazer" />
                <Picker.Item label="Coat" value="coat" />
                <Picker.Item label="Dress" value="dress" />
                <Picker.Item label="Jacket" value="jacket" />
                <Picker.Item label="Jeans" value="jeans" />
                <Picker.Item label="Kurta" value="kurta" />
                <Picker.Item label="Leggings" value="leggings" />
                <Picker.Item label="Lehenga" value="lehenga" />
                <Picker.Item label="Pants" value="pants" />
                <Picker.Item label="Pyjama" value="pyjama" />
                <Picker.Item label="Saree" value="saree" />
                <Picker.Item label="Shirt" value="shirt" />
                <Picker.Item label="Shorts" value="shorts" />
                <Picker.Item label="Top" value="top" />
                <Picker.Item label="Trousers" value="trousers" />
                <Picker.Item label="T-Shirt" value="t-shirt" />
              </Picker>
              {errors.garmentType && <Text style={styles.errorText}>{errors.garmentType}</Text>}
              <Picker
                selectedValue={newItem.colour}
                style={[styles.picker, errors.colour ? styles.errorPicker : null]}
                onValueChange={(value) => handleInputChange("colour", value)}
              >
                <Picker.Item label="Select Colour" value="" />
                <Picker.Item label="Black" value="black" />
                <Picker.Item label="Brown" value="brown" />
                <Picker.Item label="Blue" value="blue" />
                <Picker.Item label="Golden" value="golden" />
                <Picker.Item label="Green" value="green" />
                <Picker.Item label="Lilac" value="lilac" />
                <Picker.Item label="Pink" value="pink" />
                <Picker.Item label="Purple" value="purple" />
                <Picker.Item label="Red" value="red" />
                <Picker.Item label="Silver" value="silver" />
                <Picker.Item label="White" value="white" />
                <Picker.Item label="Yellow" value="yellow" />
              </Picker>
              {errors.colour && <Text style={styles.errorText}>{errors.colour}</Text>}
              <Picker
                selectedValue={newItem.size}
                style={[styles.picker, errors.size ? styles.errorPicker : null]}
                onValueChange={(value) => handleInputChange("size", value)}
              >
                <Picker.Item label="Select Size" value="" />
                <Picker.Item label="XS" value="XS" />
                <Picker.Item label="S" value="S" />
                <Picker.Item label="M" value="M" />
                <Picker.Item label="L" value="L" />
                <Picker.Item label="XL" value="XL" />
              </Picker>
              {errors.size && <Text style={styles.errorText}>{errors.size}</Text>}
              <TextInput
                placeholder="Quantity"
                style={[styles.input, errors.quantity ? styles.errorInput : null]}
                value={newItem.quantity}
                onChangeText={(text) => handleInputChange("quantity", text)}
                keyboardType="numeric"
              />
              {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
  <Text style={styles.uploadButtonText}>Pick Images (Upto 3)</Text>
</TouchableOpacity>
{errors.images && <Text style={styles.errorText}>{errors.images}</Text>}

              {newItem.images.length > 0 && (
                <View style={styles.imagePreviewContainer}>
                  <Text style={styles.selectedImagesText}>Selected Images:</Text>
                  <ScrollView horizontal>
                    {newItem.images.map((uri, index) => (
                      <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri }} style={styles.imagePreview} />
                        <TouchableOpacity
  style={styles.removeImageButton}
  onPress={() => {
    setNewItem((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index);
      // Check the number of images after removal and update error accordingly
      const newErrors = { ...errors };
      if (updatedImages.length <= 3) {
        delete newErrors.images;  // Remove the error if there are 3 or fewer images
      }
      setErrors(newErrors); // Update the errors state
      return {
        ...prev,
        images: updatedImages,
      };
    });
  }}
>
  <Text style={styles.removeImageButtonText}>×</Text>
</TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
              <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveButton} onPress={submitData}>
                  <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Save"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
  style={styles.cancelButton}
  onPress={() => {
    setModalVisible(false);
    setErrors({}); // Clear all errors
  }}
>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
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
  container: { 
    flex: 1,
    padding: 20,
   },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: 150, // Set a smaller width for the Add Item button
    alignSelf: 'center',
    marginBottom: 20,
  },
  addButtonText: { color: 'white', fontSize: 16 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
    width: '62%',
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
    height:41,
    borderWidth: 1, // Ensure there's always a border
  borderColor: '#f0f0f0', // Match the background color or set a neutral color
  },
  picker: { 
    width: '100%',
    marginBottom: 12,
    height:41,
   },
  uploadButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 4,
  },
  uploadButtonText: { color: 'white' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: {
    backgroundColor: '#FF5722',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  cancelButtonText: { 
    color: 'white',
   },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop:5,
  },
  saveButtonText: { color: 'white' },
  imagePreviewContainer: {
    marginVertical: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 13,
  },
  removeImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 50,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  selectedImagesText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15, // Add spacing below the text
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorPicker: {
    borderColor: "red",
    borderWidth: 1,
  },
});

export default AddSellerButton;
