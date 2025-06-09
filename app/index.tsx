import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function LandingPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        style={styles.backgroundImage}
        source={require("@/assets/images/1.png")}
        placeholder={{ blurhash }}
        contentFit="cover"
      />
      <StatusBar style="light" backgroundColor="#fff" />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/login")}
        >
          <Image
            style={styles.arrow}
            source={require("@/assets/images/arrow.png")}
            contentFit="fill"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end", // Align content to the bottom
    alignItems: "center",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  arrow: {
    width: 100,
    height: 80,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "80%",
    marginBottom: 100,
    paddingVertical: 10,
    borderRadius: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    marginHorizontal: 10,
  },
});
