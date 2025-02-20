import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  Button,
  TouchableOpacity,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Urgarden: A Mobile-based Planner for Vegetables Urban Gardening
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            /* Add navigation logic here */
          }}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 16,
    justifyContent: "space-between",
    width: "80%",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
