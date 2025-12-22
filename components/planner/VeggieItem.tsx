import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface VeggieItemProps {
  item: {
    image: string;
    name: string;
  };
  onPress: () => void;
  onEdit: () => void; // Callback for edit action
  onDelete: () => void; // Callback for delete action
  isAdmin: boolean;
}

const VeggieItem: React.FC<VeggieItemProps> = ({
  item,
  onPress,
  onEdit,
  onDelete,
  isAdmin,
}) => {
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false); // State for kebab menu visibility
  const scale = new Animated.Value(1);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[styles.veggieItem, { transform: [{ scale }] }]}>
        {/* Check if the image is a remote URL or a local file path */}
        {item.image && typeof item.image === "string" && !imageError ? (
          item.image.startsWith("http") || item.image.startsWith("https") ? (
            <Image
              source={{ uri: item.image }} // Remote image
              alt=""
              style={styles.veggieImage}
              onError={() => setImageError(true)}
            />
          ) : (
            <Image
              source={{ uri: item.image }}
              alt=""
              style={styles.veggieImage}
              onError={() => setImageError(true)}
            />
          )
        ) : (
          <View style={styles.fallbackImageContainer}>
            <MaterialIcons name="eco" size={80} color="#4CAF50" />
          </View>
        )}

        <Text style={styles.veggieText}>{item.name}</Text>

        {isAdmin && (
          <>
            {/* Kebab Menu Button */}
            <TouchableOpacity style={styles.kebabButton} onPress={toggleMenu}>
              <Text style={styles.kebabText}>⋮</Text>
            </TouchableOpacity>
            {/* Modal for Edit/Delete Options */}
            {menuVisible && (
              <Modal
                transparent={true}
                animationType="fade"
                visible={menuVisible}
                onRequestClose={toggleMenu}
              >
                <TouchableWithoutFeedback onPress={toggleMenu}>
                  <View style={styles.modalOverlay}>
                    <View style={styles.menuContainer}>
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                          toggleMenu();
                          onEdit();
                        }}
                      >
                        <Text style={styles.menuText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                          toggleMenu();
                          onDelete();
                        }}
                      >
                        <Text style={styles.menuText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            )}
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  veggieItem: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 8,
    minWidth: "48%",
    borderWidth: 1,
    borderColor: "#ccc",
  },

  veggieImage: {
    width: "100%",
    minWidth: 150,
    height: 150,
    borderRadius: 8,
    objectFit: "cover",
    backgroundColor: "#e0e0e0",
  },
  veggieText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 5,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    fontWeight: "bold",
  },
  fallbackImageContainer: {
    width: "100%",
    minWidth: 150,
    height: 150,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  kebabButton: {
    position: "absolute",
    top: 4,
    right: 4,
    padding: 5,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  kebabText: {
    fontSize: 20,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    width: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
});

export default VeggieItem;
