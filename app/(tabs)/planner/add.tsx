import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { categories } from "@/lib/config";
// import { addVeggieToFirebase } from "@/lib/firebaseFunctions";

interface Stage {
  stageNumber: number;
  title: string;
  description: string;
  imageUrl: string | null;
}

interface Veggie {
  name: string;
  description: string;
  type: string;
  image: string | null;
  stages: Stage[];
}

const AddVeggie = () => {
  const [formData, setFormData] = useState<Veggie>({
    name: "",
    description: "",
    type: categories[0],
    image: null,
    stages: [
      { stageNumber: 1, title: "", description: "", imageUrl: null },
      { stageNumber: 2, title: "", description: "", imageUrl: null },
      { stageNumber: 3, title: "", description: "", imageUrl: null },
    ],
  });
  const router = useRouter();

  const pickImage = async (setImageCallback: (uri: string) => void) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const handleInputChange = (field: keyof Veggie, value: string | null) => {
    setFormData({
      ...formData,
      [field]: value,
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
  };

  const handleStageImageChange = (index: number, uri: string) => {
    const newStages = [...formData.stages];
    newStages[index].imageUrl = uri;
    setFormData({
      ...formData,
      stages: newStages,
    });
  };

  const validateForm = () => {
    const { name, description, type, image, stages } = formData;
    if (!name || !description || !type || !image) {
      Alert.alert("Error", "Please fill out all fields.");
      return false;
    }
    if (stages.length < 3) {
      Alert.alert("Error", "Please add at least 3 stages.");
      return false;
    }
    for (const stage of stages) {
      if (!stage.title || !stage.description || !stage.imageUrl) {
        Alert.alert("Error", "Please fill out all stage fields.");
        return false;
      }
    }
    return true;
  };

  const handleAddPress = async () => {
    if (!validateForm()) {
      return;
    }

    console.log("Form data: ", JSON.stringify(formData, null, 2));

    // try {
    //   await addVeggieToFirebase(formData);
    //   router.back();
    // } catch (error) {
    //   console.error("Error adding vegetable: ", error);
    // }
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
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={formData.description}
        onChangeText={(value) => handleInputChange("description", value)}
        placeholder="Enter vegetable description"
      />
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
          {categories.map((category: string) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
      </View>

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
          <TextInput
            style={styles.input}
            value={stage.description}
            onChangeText={(value) =>
              handleStageChange(index, "description", value)
            }
            placeholder="Enter stage description"
          />
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
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <Button title="Add Stage" color="gray" onPress={handleAddStage} />
        <Button title="Add Vegetable" onPress={handleAddPress} />
      </View>
    </ScrollView>
  );
};

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
});

export default AddVeggie;
