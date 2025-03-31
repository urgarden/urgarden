import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { gardeningIdeas } from "@/lib/config";

export default function GardeningIdeasScreen() {
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State to store the selected image

  const openModal = (image: string) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {gardeningIdeas.ideas.map((idea) => (
          <View key={idea.id} style={styles.card}>
            <Text style={styles.cardTitle}>{idea.title}</Text>
            <Text style={styles.cardDescription}>{idea.description}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {idea.images.map((image, index) => (
                <TouchableOpacity key={index} onPress={() => openModal(image)}>
                  <Image
                    source={image}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>

      {/* Full-Screen Modal */}
      {selectedImage && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <Pressable style={styles.modalCloseButton} onPress={closeModal}>
              <Text style={styles.modalCloseText}>✕</Text>
            </Pressable>
            {/* Full-Screen Image */}
            <Image
              source={selectedImage}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
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
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
  },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  modalCloseText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
});
