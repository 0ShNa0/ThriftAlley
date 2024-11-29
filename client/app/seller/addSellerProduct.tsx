import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";

type NewItem = {
  title: string;
  price: string;
};

const AddSellerButton = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState<NewItem>({ title: "", price: "" });

  const handleInputChange = (field: keyof NewItem, value: string) => {
    setNewItem((prev) => ({
      ...prev,
      [field]: value,
    }));
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
            <TextInput
              placeholder="Item Title"
              style={styles.input}
              value={newItem.title}
              onChangeText={(text) => handleInputChange("title", text)}
            />

            <TextInput
              placeholder="Price"
              style={styles.input}
              value={newItem.price}
              onChangeText={(text) => handleInputChange("price", text)}
              keyboardType="numeric"
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    addButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 10,
      paddingHorizontal: 25,
      borderRadius: 5,
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 20,
    },
    addButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 10,
      width: '85%', // Medium size: 85% of screen width
      maxWidth: 500, // Medium size: Max width of 400px
      padding: 25, // Adjusted padding for a balanced layout
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
    },
    input: {
      backgroundColor: '#f0f0f0',
      padding: 10,
      borderRadius: 5,
      marginBottom: 12,
      width: '90%', // Ensure the input fields take up most of the modal width
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 15,
      width: '100%', // Align buttons to full width of the modal content
    },
    cancelButton: {
      backgroundColor: '#ff4d4d',
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    cancelButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
    },
    saveButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    saveButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
    },
  });
  
  export default AddSellerButton;
