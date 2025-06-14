import React, { useState, useRef, useEffect } from "react";
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
import Background from "@/components/Background";

export default function GardeningIdeasScreen() {
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State to store the selected image
  const scrollRefs = useRef<any[]>([]); // Array of refs for each horizontal ScrollView

  const openModal = (image: string) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  useEffect(() => {
    // Auto-scroll logic for each ScrollView
    scrollRefs.current.forEach((scrollRef, index) => {
      if (!scrollRef) return;

      let scrollPosition = 0;
      const interval = setInterval(() => {
        scrollRef.scrollTo({
          x: scrollPosition,
          animated: true,
        });
        scrollPosition += 150; // Adjust scroll step (matches image width)
        if (scrollPosition >= scrollRef.contentSize?.width) {
          scrollPosition = 0; // Reset to the beginning
        }
      }, 3000); // Adjust interval time (3 seconds)

      // Store the interval for cleanup
      scrollRefs.current[index].interval = interval;
    });

    return () => {
      // Clear all intervals on unmount
      scrollRefs.current.forEach((scrollRef) => {
        if (scrollRef?.interval) clearInterval(scrollRef.interval);
      });
    };
  }, []);

  return (
    <Background>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {gardeningIdeas.ideas.map((idea, ideaIndex) => (
            <View key={idea.id} style={styles.card}>
              <Text style={styles.cardTitle}>{idea.title}</Text>
              <Text style={styles.cardDescription}>{idea.description}</Text>
              <ScrollView
                horizontal
                centerContent={true}
                showsHorizontalScrollIndicator={false}
                ref={(ref) => (scrollRefs.current[ideaIndex] = ref)} // Assign ref for each ScrollView
              >
                {idea.images.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => openModal(image)}
                  >
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
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    // marginVertical: 20,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
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
