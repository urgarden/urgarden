import React, { useState, useEffect } from "react";
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
    image: string;
    name: string;
  };
  onPress: () => void;
}

const VeggieItem: React.FC<VeggieItemProps> = ({ item, onPress }) => {
  const [loading, setLoading] = useState(true);
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
        {/* Use the image URL from the database */}
        <Image source={{ uri: item.image }} style={styles.veggieImage} />
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
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    textAlign: "center", // Center text
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
});

export default VeggieItem;
