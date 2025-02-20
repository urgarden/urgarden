import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/lib/definitions/type";
import { Link, useNavigation } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/app-example/components/ThemedText";

type LoginPageProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

const LoginPage: React.FC<LoginPageProps> = ({ navigation }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const nav = useNavigation();

  const handleLogin = () => {
    // Here you would typically validate the username and password against a backend service or database
    if (username === "user" && password === "password") {
      console.log("Login successful");
      // Redirect to the main app page or dashboard
      navigation.navigate("Main");
    } else {
      setErrorMessage("Invalid username or password");
    }
  };

  const handleGuestLogin = () => {
    console.log("Guest login successful");
    navigation.navigate("Main");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topButtonsContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => nav.goBack()}
        >
          <ThemedText style={styles.backButtonText}>Back</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin}>
          <ThemedText style={styles.guestButtonText}>Guest</ThemedText>
        </TouchableOpacity>
      </View>
      <ThemedText type="title" style={styles.title}>
        URGARDEN LOGIN
      </ThemedText>
      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Username or Email:</ThemedText>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={(text) => setUsername(text)}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="username"
        />
      </View>
      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Password:</ThemedText>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          textContentType="password"
        />
      </View>
      {errorMessage && (
        <ThemedText style={styles.errorMessage}>{errorMessage}</ThemedText>
      )}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <ThemedText style={styles.buttonText}>Login</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.forgotPasswordButton}
        // onPress={() => nav.navigate("forgot-password")}
      >
        <ThemedText style={styles.forgotPasswordText}>
          Forgot Password?
        </ThemedText>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <ThemedText style={styles.signupText}>
          Need to create an account?
        </ThemedText>

        <Link href="/signup" asChild>
          <TouchableOpacity style={styles.signupButton}>
            <ThemedText style={styles.signupButtonText}>Signup</ThemedText>
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
  backButtonText: {
    fontSize: 18,
    color: "#4CAF50",
  },
  guestButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  guestButtonText: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
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
  errorMessage: {
    color: "red",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
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
  forgotPasswordText: {
    color: "#4CAF50",
    fontSize: 16,
    textAlign: "center",
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
  signupButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginPage;
