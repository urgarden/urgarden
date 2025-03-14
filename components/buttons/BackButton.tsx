import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "expo-router";

const BackButton: React.FC = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <Icon name="arrow-left" size={20} color="#4CAF50" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
});

export default BackButton;
