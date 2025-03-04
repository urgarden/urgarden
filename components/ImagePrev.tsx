import { StyleSheet, Text, View, Image } from "react-native";
import Swiper from "react-native-swiper";

interface ImagePreviewerProps {
  imageUrls: (string | number)[];
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
        autoplay={true} // Enable autoplay
        autoplayTimeout={3} // Set autoplay timeout to 3 seconds
      >
        {imageUrls.map((imageUrl, index) => (
          <View key={index} style={styles.slide}>
            <Image
              style={styles.image}
              source={
                typeof imageUrl === "string" ? { uri: imageUrl } : imageUrl
              }
            />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: "120%",
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
    width: "100%",
    height: "100%",
    resizeMode: "cover",

    alignSelf: "center",
  },
  buttonText: {
    fontSize: 50,
    margin: 10,
    color: "#fff",
  },
});

export default ImagePreviewer;
