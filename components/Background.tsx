import React from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

type Props = {
  children: React.ReactNode;
  imageSource?: any; // Optional: allow custom image
};

const Background: React.FC<Props> = ({
  children,
  imageSource = require("@/assets/images/authBg.png"),
}) => (
  <View style={styles.container}>
    <Image
      style={styles.backgroundImage}
      source={imageSource}
      placeholder={{ blurhash }}
      contentFit="cover"
      transition={1000}
    />
    <View style={styles.content}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Background;
