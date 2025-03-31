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

  if (loading) {
    return (
      <View style={styles.veggieItem}>
        <View style={styles.skeletonImage} />
        <View style={styles.skeletonText} />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[styles.veggieItem, { transform: [{ scale }] }]}>
        {/* Check if the image is a remote URL or a local file path */}
        {item.image && typeof item.image === "string" ? (
          item.image.startsWith("http") || item.image.startsWith("https") ? (
            <Image
              source={{ uri: item.image }} // Remote image
              alt=""
              style={styles.veggieImage}
            />
          ) : (
            <Image
              source={{ uri: item.image }}
              alt=""
              style={styles.veggieImage}
            />
          )
        ) : (
          <View style={styles.skeletonImage} />
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
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  veggieItem: {
    flexDirection: "column",
    alignItems: "center",
    padding: 16,
    marginTop: 4,
    margin: 5,
    borderRadius: 8,
    minWidth: "48%",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },

  veggieImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    objectFit: "cover",
    backgroundColor: "#e0e0e0",
  },
  veggieText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
  skeletonImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e0e0e0",
    marginBottom: 10,
  },
  skeletonText: {
    width: 60,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    marginTop: 10,
  },
  kebabButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
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
