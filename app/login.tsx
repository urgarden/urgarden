import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import ThemedText from "@/components/ThemedText";
import InputField from "@/components/InputField";
import ProceedButton from "@/components/buttons/ProceedButton";
import { login } from "@/lib/api/auth";
import { showMessage } from "react-native-flash-message";
import { useUserStore } from "@/lib/stores/userStore";
import Background from "@/components/Background";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await login(email, password);
      if (result.error) {
        showMessage({
          message: "Login Failed",
          description: result.message,
          type: "danger",
          position: "bottom",
          floating: true,
        });
      } else {
        const user = result.user;
        const role = user?.role === "admin" ? "admin" : "customer";

        // Save user details in Zustand store with role set to "customer"
        useUserStore.getState().setUserDetails({
          id: user?.id ?? "",
          email: user?.email ?? "",
          role: role,
        });

        showMessage({
          message: "Login Successful",
          description: "You have successfully logged in!",
          type: "success",
          position: "top",
          floating: true,
        });
        router.push("/(tabs)/home");
      }
    } catch (error) {
      showMessage({
        message: "Login Failed",
        description: "An error occurred during login. Please try again.",
        type: "danger",
        position: "bottom",
        floating: true,
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

    router.push("/(tabs)/home");
  };

  const buttons = [
    {
      style: styles.guestButton,
      onPress: handleGuestLogin,
      text: <ThemedText type="linkB">Guest</ThemedText>,
    },
  ];

  return (
    <Background>
      <View style={styles.content}>
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

        <Link href="/forgot-password" asChild>
          <TouchableOpacity style={styles.forgotPasswordButton}>
            <ThemedText type="linkB">Forgot Password?</ThemedText>
          </TouchableOpacity>
        </Link>
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
    </Background>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  topButtonsContainer: {
    position: "sticky",
    top: -100,
    alignItems: "flex-start",
    width: "100%",
  },
  guestButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
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
