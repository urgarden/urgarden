import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

type InputFieldProps = TextInputProps & {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  ...props
}) => {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}:</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formGroup: {
    width: "80%",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
});

export default InputField;
