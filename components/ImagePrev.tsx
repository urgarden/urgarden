import { StyleSheet, Text, View, Image } from "react-native";
import Swiper from "react-native-swiper";

interface ImagePreviewerProps {
  imageUrls: string[];
}

const ImagePreviewer = ({ imageUrls }: ImagePreviewerProps) => {
  return (
    <View style={styles.container}>
      <Swiper
        nextButton={<Text style={styles.buttonText}>›</Text>}
        prevButton={<Text style={styles.buttonText}>‹</Text>}
        activeDotColor="#fff"
        style={styles.wrapper}
        showsButtons={true}
      >
        {imageUrls.map((imageUrl, index) => (
          <View key={index} style={styles.slide}>
            <Image style={styles.image} source={{ uri: imageUrl }} />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: "100%",
  },
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },
  slide: {
    flex: 1,
  },
  image: {
    width: "80%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#757575",
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 50,
    color: "#fff",
  },
});

export default ImagePreviewer;
