import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "expo-router";
import { validateSignupFormData } from "@/utils/validation";
import { signupFormFields } from "@/utils/formFields";
import InputField from "@/components/InputField";
import BackButton from "@/components/buttons/BackButton";
import ThemedText from "@/components/ThemedText";
import { signup } from "@/services/FirebaseService";
import ProceedButton from "@/components/buttons/ProceedButton";
import { showMessage } from "react-native-flash-message";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState<{ [key: string]: string }>(
    {}
  );

  const nav = useNavigation();

  type FormField = "username" | "email" | "password" | "confirmPassword";

  const handleInputChange = (name: FormField, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async () => {
    const error = validateSignupFormData(formData);
    if (error) {
      setErrorMessage(error);
      return;
    }

    const result = await signup(formData);

    if (result.error) {
      showMessage({
        message: "Signup Failed!",
        description: result.message,
        type: "danger",
      });
      return;
    } else {
      showMessage({
        message: "Signup Successful!",
        type: "success",
      });
      nav.navigate("login" as never);
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />

      <ThemedText type="title">URGARDEN SIGNUP</ThemedText>
      {signupFormFields.map((field) => (
        <View key={field.name} style={styles.formGroup}>
          <InputField
            label={field.label}
            value={formData[field.name as FormField]}
            onChangeText={(text: string) =>
              handleInputChange(field.name as FormField, text)
            }
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={field.keyboardType as any}
            textContentType={field.textContentType as any}
            secureTextEntry={field.secureTextEntry}
          />
          {errorMessage[field.name] && (
            <View style={styles.errorMessageContainer}>
              <ThemedText type="errorMessage">
                {errorMessage[field.name]}
              </ThemedText>
            </View>
          )}
        </View>
      ))}
      <ProceedButton title="Signup" onPress={handleSignup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },

  formGroup: {
    width: "100%",
    alignItems: "center",
  },
  errorMessageContainer: {
    marginTop: -15,
    textAlign: "left",
    width: "80%",
    justifyContent: "flex-start",
  },
});

export default SignupPage;
