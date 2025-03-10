import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";

interface VeggieItemProps {
  item: {
    image: any;
    name: string;
  };
  onPress: () => void;
}

const VeggieItem: React.FC<VeggieItemProps> = ({ item, onPress }) => {
  const scale = new Animated.Value(1);

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

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[styles.veggieItem, { transform: [{ scale }] }]}>
        <Image source={item.image} style={styles.veggieImage} />
        <Text style={styles.veggieText}>{item.name}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  veggieItem: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    marginTop: 20,
    margin: 5,
    borderRadius: 8,
    minWidth: "45%",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  veggieImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  veggieText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center", // Center text
  },
});

export default VeggieItem;
