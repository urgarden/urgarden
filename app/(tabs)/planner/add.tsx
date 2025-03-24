import { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { categories } from "@/lib/config";
import { showMessage } from "react-native-flash-message";
import { validateVeggieForm } from "@/lib/veggieValidation";
import { VeggieForm, Stage } from "@/lib/definitions";
import { createVeggie } from "@/lib/api/veggie";

const AddVeggie = () => {
  const [formData, setFormData] = useState<VeggieForm>({
    name: "",
    description: "",
    type: categories[0].value,
    image: null,
    stages: [
      { stageNumber: 1, title: "", description: "", imageUrl: null },
      { stageNumber: 2, title: "", description: "", imageUrl: null },
      { stageNumber: 3, title: "", description: "", imageUrl: null },
    ],
  });
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const pickImage = async (setImageCallback: (uri: string) => void) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageCallback(result.assets[0].uri);
    }
  };

  const handleAddStage = () => {
    const newStageNumber = formData.stages.length + 1;
    setFormData({
      ...formData,
      stages: [
        ...formData.stages,
        {
          stageNumber: newStageNumber,
          title: "",
          description: "",
          imageUrl: null,
        },
      ],
    });
  };

  const handleInputChange = (field: keyof VeggieForm, value: string | null) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    setErrors({
      ...errors,
      [field]: "",
    });
  };

  const handleStageChange = (
    index: number,
    field: keyof Stage,
    value: string
  ) => {
    const newStages = [...formData.stages];
    (newStages[index][field] as string) = value;
    setFormData({
      ...formData,
      stages: newStages,
    });
    setErrors({
      ...errors,
      stages: {
        ...errors.stages,
        [index]: {
          ...errors.stages?.[index],
          [field]: "",
        },
      },
    });
  };

  const handleStageImageChange = (index: number, uri: string) => {
    const newStages = [...formData.stages];
    newStages[index].imageUrl = uri;
    setFormData({
      ...formData,
      stages: newStages,
    });
    setErrors({
      ...errors,
      stages: {
        ...errors.stages,
        [index]: {
          ...errors.stages?.[index],
          imageUrl: "",
        },
      },
    });
  };

  const handleAddPress = async () => {
    const { valid, newErrors } = validateVeggieForm(formData);
    if (!valid) {
      setErrors(newErrors);
      showMessage({
        message: "Please fix the errors in the form.",
        type: "danger",
      });
      return;
    }

    setLoading(true); // Start loading animation
    try {
      const result = await createVeggie(formData);
      if (result.success) {
        showMessage({
          message: result.message,
          type: "success",
        });
        router.back();
      } else {
        showMessage({
          message: "Error adding vegetable.",
          description: result.message,
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Error adding vegetable: ", error);
      showMessage({
        message: "Error adding vegetable.",
        type: "danger",
      });
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(value) => handleInputChange("name", value)}
        placeholder="Enter vegetable name"
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={formData.description}
        onChangeText={(value) => handleInputChange("description", value)}
        placeholder="Enter vegetable description"
      />
      {errors.description && (
        <Text style={styles.errorText}>{errors.description}</Text>
      )}
      <Text style={styles.label}>Type</Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          height: 55,
          marginBottom: 10,
        }}
      >
        <Picker
          selectedValue={formData.type}
          style={styles.picker}
          onValueChange={(itemValue: string) =>
            handleInputChange("type", itemValue)
          }
        >
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
        onPress={() => pickImage((uri) => handleInputChange("image", uri))}
        style={styles.imagePicker}
      >
        <Text style={styles.imagePickerText}>Pick an image from gallery</Text>
      </TouchableOpacity>
      {formData.image && (
        <Image source={{ uri: formData.image }} style={styles.image} />
      )}
      {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
      <Text style={styles.label}>Growing Stages</Text>
      {formData.stages.map((stage, index) => (
        <View key={index} style={styles.stageContainer}>
          <Text style={styles.stageLabel}>Stage {index + 1}</Text>
          <TextInput
            style={styles.input}
            value={stage.title}
            onChangeText={(value) => handleStageChange(index, "title", value)}
            placeholder="Enter stage title"
          />
          {errors.stages?.[index]?.title && (
            <Text style={styles.errorText}>{errors.stages[index].title}</Text>
          )}
          <TextInput
            style={styles.input}
            value={stage.description}
            onChangeText={(value) =>
              handleStageChange(index, "description", value)
            }
            placeholder="Enter stage description"
          />
          {errors.stages?.[index]?.description && (
            <Text style={styles.errorText}>
              {errors.stages[index].description}
            </Text>
          )}
          <TouchableOpacity
            onPress={() =>
              pickImage((uri) => handleStageImageChange(index, uri))
            }
            style={styles.imagePicker}
          >
            <Text style={styles.imagePickerText}>Photo/Icon</Text>
          </TouchableOpacity>
          {stage.imageUrl && (
            <Image source={{ uri: stage.imageUrl }} style={styles.image} />
          )}
          {errors.stages?.[index]?.imageUrl && (
            <Text style={styles.errorText}>
              {errors.stages[index].imageUrl}
            </Text>
          )}
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <Button title="Add Stage" color="gray" onPress={handleAddStage} />
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <Button title="Add Vegetable" onPress={handleAddPress} />
        )}
      </View>
    </ScrollView>
  );
};

export default AddVeggie;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
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
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 16,
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
  stageContainer: {
    marginBottom: 16,
  },
  stageLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
    alignSelf: "flex-start",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 16,
    paddingBottom: 40,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
});
