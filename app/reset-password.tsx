import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router"; // Use router for navigation
import { showMessage } from "react-native-flash-message"; // Import flash message for notifications

const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter(); // Initialize the router for navigation

  const handleResetPassword = async () => {
    if (!newPassword) {
      showMessage({
        message: "Error",
        description: "Please enter a new password.",
        type: "danger",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        showMessage({
          message: "Error",
          description: "Failed to reset password: " + error.message,
          type: "danger",
        });
      } else {
        showMessage({
          message: "Success",
          description: "Password reset successfully! Redirecting to login...",
          type: "success",
        });

        // Redirect to login screen after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      showMessage({
        message: "Error",
        description: "An unexpected error occurred. Please try again.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Resetting..." : "Reset Password"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#A5D6A7",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ResetPasswordScreen;
