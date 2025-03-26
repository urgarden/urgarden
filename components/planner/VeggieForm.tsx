import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { categories } from "@/lib/config";
import { VeggieType } from "@/lib/definitions";

interface VeggieFormProps {
  formData: {
    name: string;
    description: string;
    type: string;
    image: string | null;
  };
  errors: any;
  onInputChange: (field: keyof VeggieType, value: string | null) => void;
  pickImage: (setImageCallback: (uri: string) => void) => void;
}

const VeggieForm: React.FC<VeggieFormProps> = ({
  formData,
  errors,
  onInputChange,
  pickImage,
}) => {
  return (
    <View>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(value) => onInputChange("name", value)}
        placeholder="Enter vegetable name"
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={formData.description}
        onChangeText={(value) => onInputChange("description", value)}
        placeholder="Enter vegetable description"
      />
      {errors.description && (
        <Text style={styles.errorText}>{errors.description}</Text>
      )}

      <Text style={styles.label}>Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.type}
          style={styles.picker}
          onValueChange={(itemValue: string) =>
            onInputChange("type", itemValue)
          }
        >
          <Picker.Item
            key={0}
            label={"Select a category"}
            value={""} // Empty string as the default value
            enabled={false} // Disable this option to prevent selection
          />
          {categories.map((category) => (
            <Picker.Item
              key={category.id}
              label={category.title}
              value={category.value}
            />
          ))}
        </Picker>
      </View>
      {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}

      <Text style={styles.label}>Image</Text>
      <TouchableOpacity
        onPress={() => pickImage((uri) => onInputChange("image", uri))}
        style={styles.imagePicker}
      >
        <Text style={styles.imagePickerText}>Pick an image from gallery</Text>
      </TouchableOpacity>
      {formData.image && (
        <Image source={{ uri: formData.image }} style={styles.image} />
      )}
      {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    height: 55,
    marginBottom: 10,
  },
  picker: {
    height: 55,
    width: "100%",
  },
  imagePicker: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  imagePickerText: {
    color: "#fff",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
});

export default VeggieForm;
