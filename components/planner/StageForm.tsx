import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Stage } from "@/lib/definitions";

interface StageFormProps {
  stage: Stage;
  index: number;
  errors: any;
  onStageChange: (index: number, field: keyof Stage, value: string) => void;
  onImageChange: (index: number, uri: string) => void;
  pickImage: (setImageCallback: (uri: string) => void) => void;
}

const StageForm: React.FC<StageFormProps> = ({
  stage,
  index,
  errors,
  onStageChange,
  onImageChange,
  pickImage,
}) => {
  return (
    <View style={styles.stageContainer}>
      <Text
        style={{
          ...styles.stageLabel,
          borderTopColor: "#ccc",
          borderTopWidth: 1,
          paddingTop: 10,
        }}
      >
        Stage {index + 1}
      </Text>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TextInput
          style={{ ...styles.input, width: "48%" }}
          value={stage.title}
          onChangeText={(value) => onStageChange(index, "title", value)}
          placeholder="Enter stage title"
        />
        {errors?.[index]?.title && (
          <Text style={styles.errorText}>{errors[index].title}</Text>
        )}
        <TextInput
          style={{ ...styles.input, width: "48%" }}
          value={
            stage.stageEndDays !== 1 ? String(stage.stageEndDays) : undefined
          }
          onChangeText={(value) => onStageChange(index, "stageEndDays", value)}
          placeholder="Number of Days"
          keyboardType="numeric"
        />
        {errors?.[index]?.title && (
          <Text style={styles.errorText}>{errors[index].title}</Text>
        )}
      </View>

      <TextInput
        style={styles.input}
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

const styles = StyleSheet.create({
  stageContainer: {
    marginBottom: 16,
  },
  stageLabel: {
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

export default StageForm;
