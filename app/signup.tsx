import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { validateSignupFormData } from "@/utils/validation";
import { signupFormFields } from "@/utils/formFields";
import InputField from "@/components/InputField";

import ThemedText from "@/components/ThemedText";
import { signup } from "@/lib/api/auth";
import ProceedButton from "@/components/buttons/ProceedButton";
import { showMessage } from "react-native-flash-message";
import { Image } from "expo-image";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

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

  const nav = useRouter();

  type FormField = "username" | "email" | "password" | "confirmPassword";

  const handleInputChange = (name: FormField, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async () => {
    // Validate the form data
    const error = validateSignupFormData(formData);
    if (error) {
      setErrorMessage(error);
      return;
    }

    // Call the Supabase signup function
    const result = await signup(formData);

    if (result.error) {
      // Show error message if signup fails
      showMessage({
        message: "Signup Failed!",
        description: result.message,
        type: "danger",
      });
      return;
    } else {
      // Show success message and navigate to login
      showMessage({
        message: "Signup Successful!",
        type: "success",
      });
      nav.navigate("login" as never);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.backgroundImage}
        source={require("@/assets/images/authBg.png")}
        placeholder={{ blurhash }}
        contentFit="cover"
      />
      <ThemedText type="title">URGARDEN</ThemedText>
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
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    zIndex: -1,
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
