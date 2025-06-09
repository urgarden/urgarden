import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Stage } from "@/lib/definitions";

interface StageFormProps {
  stage: Stage;
  index: number;
  errors: any;
  onStageChange: (index: number, field: keyof Stage, value: string) => void;
  onImageChange: (index: number, uri: string) => void;
  pickImage: (setImageCallback: (uri: string) => void) => void;
  onRemoveStage: (index: number) => void; // New prop to handle stage removal
}

const StageForm: React.FC<StageFormProps> = ({
  stage,
  index,
  errors,
  onStageChange,
  onImageChange,
  pickImage,
  onRemoveStage,
}) => {
  return (
    <View style={styles.stageContainer}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {/* Add Remove Stage Button */}

        <Text style={styles.stageLabel}>Stage {index + 1}</Text>
        <TouchableOpacity
          onPress={() => onRemoveStage(index)}
          style={styles.removeButton}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1, width: "100%", marginBottom: 8 }}>
          <TextInput
            style={{ ...styles.input, width: "95%" }}
            value={stage.title}
            onChangeText={(value) => onStageChange(index, "title", value)}
            placeholder="Enter stage title"
          />
          {errors?.[index]?.title && (
            <Text style={styles.errorText}>{errors[index].title}</Text>
          )}
        </View>
        <View style={{ flex: 1, width: "48%", marginBottom: 8 }}>
          <TextInput
            style={{ ...styles.input, width: "95%" }}
            value={
              stage.stageEndDays !== 1 && stage.stageEndDays !== undefined
                ? String(stage.stageEndDays)
                : ""
            }
            onChangeText={(value) => {
              // Only allow numbers
              const numericValue = value.replace(/[^0-9]/g, "");
              onStageChange(index, "stageEndDays", numericValue);
            }}
            placeholder="Number of Days"
            keyboardType="numeric"
          />
          {errors?.[index]?.stageEndDays && (
            <Text style={styles.errorText}>{errors[index].stageEndDays}</Text>
          )}
        </View>
      </View>

      <TextInput
        style={styles.input}
        multiline={true}
        numberOfLines={4}
        value={stage.description}
        onChangeText={(value) => onStageChange(index, "description", value)}
        placeholder="Enter stage description"
      />
      {errors?.[index]?.description && (
        <Text style={styles.errorText}>{errors[index].description}</Text>
      )}
      <TouchableOpacity
        onPress={() => pickImage((uri) => onImageChange(index, uri))}
        style={styles.imagePicker}
      >
        <Text style={styles.imagePickerText}>Photo/Icon</Text>
      </TouchableOpacity>
      {stage.imageUrl && (
        <Image source={{ uri: stage.imageUrl }} style={styles.image} />
      )}
      {errors?.[index]?.imageUrl && (
        <Text style={styles.errorText}>{errors[index].imageUrl}</Text>
      )}
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  stageContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    borderRadius: 8,
  },
  stageLabel: {
    fontSize: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
  },
  input: {
    height: "auto",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    width: screenWidth - 64,
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
  removeButton: {
    backgroundColor: "red",
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
    alignItems: "center",
    height: 30,
    width: "auto",
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default StageForm;
