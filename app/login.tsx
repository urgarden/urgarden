import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/lib/navigationTypes";
import { Link, useNavigation } from "expo-router";
import ThemedText from "@/components/ThemedText";
import InputField from "@/components/InputField";
import ProceedButton from "@/components/buttons/ProceedButton";
import { login } from "@/lib/api/auth";
import { showMessage } from "react-native-flash-message";
import { useUserStore } from "@/lib/stores/userStore";

type LoginPageProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "login">;
};

const LoginPage: React.FC<LoginPageProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    try {
      const result = await login(email, password); // Call Supabase login function
      if (result.error) {
        showMessage({
          message: "Login Failed",
          description: result.message,
          type: "danger",
        });
      } else {
        const user = result.user; // Get the user object from the login result

        // Save user details in Zustand store with role set to "customer"
        useUserStore.getState().setUserDetails({
          id: user?.id ?? "",
          email: user?.email ?? "",
          role: "customer", // Set role to "customer" for authenticated users
        });

        showMessage({
          message: "Login Successful",
          description: "You have successfully logged in!",
          type: "success",
        });
        console.log("Login successful");
        nav.navigate("(tabs)", { screen: "Home" }); // Navigate to the home screen
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
    // Clear user details and set role to "guest"
    useUserStore.getState().clearUserDetails();
    useUserStore.getState().setUserDetails({
      id: "",
      email: "",
      role: "guest",
    });

    nav.navigate("(tabs)", { screen: "Home" }); // Navigate to the home screen as a guest
  };

  const navigateToForgotPassword = () => {
    nav.navigate("forgot-password");
  };

  const buttons = [
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
            {button.text}
          </TouchableOpacity>
        ))}
      </View>
      <ThemedText type="title">URGARDEN LOGIN</ThemedText>
      <InputField
        label="Email"
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
        onPress={navigateToForgotPassword} // Navigate to Forgot Password screen
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
