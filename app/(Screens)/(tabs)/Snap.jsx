import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Snap() {
  const [imageUri, setImageUri] = useState(null);

  // Load image from AsyncStorage on screen load
  useEffect(() => {
    loadImage();
  }, []);

  const loadImage = async () => {
    try {
      const storedImage = await AsyncStorage.getItem("cameraImage");
      if (storedImage) {
        setImageUri(storedImage);
      }
    } catch (error) {
      console.log("Error loading image", error);
    }
  };

  const openCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission required", "Camera permission is needed");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;

        // Save to AsyncStorage
        await AsyncStorage.setItem("cameraImage", uri);

        // Show image
        setImageUri(uri);
      }
    } catch (error) {
      console.log("Camera error", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={openCamera}>
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    marginTop: 20,
    width: 250,
    height: 250,
    borderRadius: 12,
  },
});
