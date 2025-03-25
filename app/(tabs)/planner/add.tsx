import { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Button,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { showMessage } from "react-native-flash-message";
import { validateVeggieForm } from "@/lib/veggieValidation";
import { VeggieType, Stage } from "@/lib/definitions";
import { createVeggie, updateVeggie } from "@/lib/api/veggie";
import VeggieForm from "@/components/planner/VeggieForm";
import StageForm from "@/components/planner/StageForm";

const AddVeggie = () => {
  const router = useRouter();
  const { mode, veggie } = useLocalSearchParams();

  const [formData, setFormData] = useState<VeggieType>({
    name: "",
    description: "",
    type: "leaf",
    image: null,
    stages: [
      {
        stageNumber: 1,
        title: "",
        description: "",
        imageUrl: null,
        stageEndDate: 1,
      },
    ],
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // Pre-fill the form if in "edit" mode
  useEffect(() => {
    if (mode === "edit" && veggie) {
      setFormData(JSON.parse(veggie as string)); // Parse the veggie data passed as a string
    }
  }, [mode, veggie]);

  const pickImage = async (setImageCallback: (uri: string) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
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
          stageEndDate: 1,
        },
      ],
    });
  };

  const handleInputChange = (field: keyof VeggieType, value: string | null) => {
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

  const handleSavePress = async () => {
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
      let result;
      if (mode === "edit") {
        // Update veggie if in "edit" mode
        if (formData.id) {
          result = await updateVeggie(String(formData.id), formData);
        } else {
          throw new Error("Veggie ID is missing.");
        }
      } else {
        // Create veggie if in "add" mode
        result = await createVeggie(formData);
      }

      if (result.success) {
        showMessage({
          message: result.message,
          type: "success",
        });
        router.back();
      } else {
        showMessage({
          message: "Error saving vegetable.",
          description: result.message,
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Error saving vegetable: ", error);
      showMessage({
        message: "Error saving vegetable.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <VeggieForm
        formData={formData}
        errors={errors}
        onInputChange={handleInputChange}
        pickImage={pickImage}
      />

      {formData.stages.map((stage, index) => (
        <StageForm
          key={index}
          stage={stage}
          index={index}
          errors={errors.stages}
          onStageChange={handleStageChange}
          onImageChange={handleStageImageChange}
          pickImage={pickImage}
        />
      ))}

      <View style={styles.buttonContainer}>
        <Button title="Add Stage" color="gray" onPress={handleAddStage} />
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <Button
            title={mode === "edit" ? "Save Changes" : "Add Vegetable"}
            onPress={handleSavePress}
          />
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
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 16,
    paddingBottom: 40,
  },
});
