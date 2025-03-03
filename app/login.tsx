import { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Link, useNavigation } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import ThemedText from "@/components/ThemedText";
import InputField from "@/components/InputField";
import ProceedButton from "@/components/buttons/ProceedButton";
import { login } from "@/services/FirebaseService";
import { showMessage } from "react-native-flash-message";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const nav = useNavigation();

  const handleLogin = async () => {
    try {
      const result = await login(email, password);
      if (result.error) {
        showMessage({
          message: "Login Failed",
          description: result.message,
          type: "danger",
        });
      } else {
        showMessage({
          message: "Login Successful",
          description: "You have successfully logged in!",
          type: "success",
        });
        console.log("Login successful");
        // nav.navigate("(tabs)/home");
      }
    } catch (error) {
      showMessage({
        message: "Login Failed",
        description: "An error occurred during login. Please try again.",
        type: "danger",
      });
    }
  };

  const handleGuestLogin = () => {
    console.log("Guest login successful");
    nav.navigate("(tabs)/Home" as never);
  };

  const buttons = [
    {
      style: styles.backButton,
      onPress: () => nav.goBack(),
      icon: <Icon name="arrow-left" size={20} color="#4CAF50" />,
    },
    {
      style: styles.guestButton,
      onPress: handleGuestLogin,
      text: <ThemedText type="linkB">Guest</ThemedText>,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topButtonsContainer}>
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={button.style}
            onPress={button.onPress}
          >
            {button.icon || button.text}
          </TouchableOpacity>
        ))}
      </View>
      <ThemedText type="title">URGARDEN LOGIN</ThemedText>
      <InputField
        label="Username or Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="username"
      />
      <InputField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="password"
      />
      {errorMessage && (
        <ThemedText type="errorMessage">{errorMessage}</ThemedText>
      )}
      <ProceedButton title="Login" onPress={handleLogin} />
      <TouchableOpacity
        style={styles.forgotPasswordButton}
        // onPress={() => nav.navigate("forgot-password")}
      >
        <ThemedText type="link">Forgot Password?</ThemedText>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <ThemedText style={styles.signupText}>
          Need to create an account?
        </ThemedText>

        <Link href="/signup" asChild>
          <TouchableOpacity style={styles.signupButton}>
            <ThemedText type="linkB">Signup</ThemedText>
          </TouchableOpacity>
        </Link>
      </View>
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
  topButtonsContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  guestButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  forgotPasswordButton: {
    marginBottom: 20,
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  signupText: {
    fontSize: 16,
    color: "#333",
  },
  signupButton: {
    marginLeft: 5,
  },
});

export default LoginPage;
