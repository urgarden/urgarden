import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { GrowingCondition } from "@/lib/definitions";

interface PlantFormProps {
  visible: boolean; // Controls modal visibility
  onClose: () => void; // Function to close the modal
  onSubmit: (formData: GrowingCondition[]) => void; // Submit array of growing conditions
  initialValues?: GrowingCondition[]; // Initial values for growing conditions
}

export default function GrowingFormModal({
  visible,
  onClose,
  onSubmit,
  initialValues = [],
}: PlantFormProps) {
  const [growingConditions, setGrowingConditions] =
    useState<GrowingCondition[]>(initialValues);

  const handleAddRow = () => {
    setGrowingConditions([
      ...growingConditions,
      { title: "", description: "", image: "" },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedConditions = growingConditions.filter((_, i) => i !== index);
    setGrowingConditions(updatedConditions);
  };

  const handleFieldChange = (
    index: number,
    field: keyof GrowingCondition,
    value: string
  ) => {
    const updatedConditions = [...growingConditions];
    updatedConditions[index][field] = value;
    setGrowingConditions(updatedConditions);
  };

  const handleImageUpload = async (index: number) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "You need to allow access to your media library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const updatedConditions = [...growingConditions];
      updatedConditions[index].image = result.assets[0].uri;
      setGrowingConditions(updatedConditions);
    }
  };

  const handleSubmit = () => {
    if (
      growingConditions.some(
        (condition) =>
          !condition.title || !condition.description || !condition.image
      )
    ) {
      Alert.alert(
        "Error",
        "All fields are required for each growing condition."
      );
      return;
    }

    onSubmit(growingConditions);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Basic Growing Requirements</Text>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {growingConditions.map((condition, index) => (
              <View key={index} style={styles.conditionContainer}>
                <Text
                  style={{
                    textAlign: "center",
                    width: "100%",
                    backgroundColor: "#f0f0f0",
                    padding: 8,
                    borderRadius: 8,
                    marginBottom: 8,
                    fontWeight: "bold",
                  }}
                >
                  {index + 1}
                </Text>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter title"
                  value={condition.title}
                  onChangeText={(text) =>
                    handleFieldChange(index, "title", text)
                  }
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter description"
                  value={condition.description}
                  onChangeText={(text) =>
                    handleFieldChange(index, "description", text)
                  }
                  multiline
                  numberOfLines={4}
                />

                <Text style={styles.label}>Image</Text>
                {condition.image ? (
                  <Image
                    source={{ uri: condition.image }}
                    style={styles.imagePreview}
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.imageUploadButton}
                    onPress={() => handleImageUpload(index)}
                  >
                    <Text style={styles.imageUploadText}>Upload Image</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveRow(index)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={handleAddRow}>
              <Text style={styles.addButtonText}>Add Requirement</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.submitButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    height: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  conditionContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  imageUploadButton: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#4CAF50",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  imageUploadText: {
    color: "#4CAF50",
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: "#f44336",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
