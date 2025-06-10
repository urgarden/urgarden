import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { compostMaterials, organicPlantCare } from "@/lib/config";
import Background from "@/components/Background";

export default function OrganicScreen() {
  const [expandedType, setExpandedType] = useState<string | null>(null); // State to track the expanded dropdown for compost materials
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null); // State to track the expanded dropdown for plant care methods

  const toggleDropdown = (type: string) => {
    setExpandedType((prev) => (prev === type ? null : type)); // Toggle the dropdown for compost materials
  };

  const toggleMethodDropdown = (method: string) => {
    setExpandedMethod((prev) => (prev === method ? null : method)); // Toggle the dropdown for plant care methods
  };

  return (
    <Background>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Organic Plant Care Methods */}
        <Text style={styles.sectionTitle}>Plant Care Methods</Text>
        {organicPlantCare.methods.map((method) => (
          <View key={method.name} style={styles.card}>
            <TouchableOpacity
              onPress={() => toggleMethodDropdown(method.name)}
              style={styles.dropdownHeader}
            >
              <Text style={styles.cardTitle}>{method.name}</Text>
              <Text style={styles.dropdownIcon}>
                {expandedMethod === method.name ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>
            {expandedMethod === method.name && (
              <View style={styles.dropdownContent}>
                <Text style={styles.cardSubtitle}>Preparation:</Text>
                <Text style={styles.cardText}>{method.preparation}</Text>
                <Text style={styles.cardSubtitle}>Usage:</Text>
                <Text style={styles.cardText}>{method.usage}</Text>
              </View>
            )}
          </View>
        ))}

        {/* Compost Materials */}
        <Text style={styles.sectionTitle}>Compost Materials</Text>
        {compostMaterials.types.map((type) => (
          <View key={type.type} style={styles.card}>
            <TouchableOpacity
              onPress={() => toggleDropdown(type.type)}
              style={styles.dropdownHeader}
            >
              <Text style={styles.cardTitle}>{type.type}</Text>
              <Text style={styles.dropdownIcon}>
                {expandedType === type.type ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>
            {expandedType === type.type && (
              <View style={styles.dropdownContent}>
                {type.items.map((item) => (
                  <Text key={item} style={styles.cardText}>
                    • {item}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0)",
    width: "100%",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "semibold",
    color: "#4CAF50",
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    color: "#555",
  },
  cardText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownIcon: {
    fontSize: 16,
    color: "#4CAF50",
  },
  dropdownContent: {
    marginTop: 8,
  },
});
