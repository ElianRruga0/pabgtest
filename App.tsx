import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Dimensions,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { generateBg, useMediaData } from "./generateBg";
import { useEffect, useState } from "react";

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [bgResponse, setBgResponse] = useState<string>("");
  const [bgResponseLoading, setBgResponseLoading] = useState<boolean>(false);

  const pickImage = async () => {
    setBgResponseLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      const { filename, type } = useMediaData(uri);

      setSelectedImage(uri);

      const params = new FormData();
      //@ts-ignore
      params.append("imageFile", { uri, name: filename, type });
      params.append("prompt", "an empty professional car showroom ");

      const response = await generateBg(params);
      setBgResponse(response);
      setBgResponseLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text
          style={{
            fontSize: 12,
            marginBottom: 20,
          }}
        >
          After selecting the image, a call to the api will be made
        </Text>
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>Pick an image</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <Image
            source={
              selectedImage
                ? { uri: selectedImage }
                : require("./assets/icon.png")
            }
            style={styles.image}
          />
        </View>

        <Text style={styles.requestTitle}>👇 Request response 👇</Text>
        <Text style={[styles.requestTitle, { fontWeight: "500" }]}>
          {bgResponseLoading ? "Loading..." : bgResponse || "No response yet"}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  button: {
    backgroundColor: "#841584",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  image: {
    width: width - 40,
    height: height / 2,
    resizeMode: "cover",
  },
  requestTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
});
