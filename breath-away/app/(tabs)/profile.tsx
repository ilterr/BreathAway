import { View, Text, TouchableOpacity, Image, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { getCurrentUser, signOut, uploadImage } from "@/lib/appwrite";
import Logout from "../../assets/icons/logout.png";
import AppGradient from "@/components/AppGradient";
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [username, setUsername] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then((res: any) => {
        setUsername(res.username);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/sign-in");
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need media permissions to upload an image!');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const fileUri = result.assets[0].uri;
        const mimeType = result.assets[0].type ?? 'image/jpeg';

        setImageUri(fileUri);

        await uploadImage(fileUri, mimeType);
      } else {
        console.error("No image selected or user canceled");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  return (
    <AppGradient colors={["#161B2E", "#0A4D4A", "#766E67"]}>
      <View className="flex justify-between">
        <View className="flex-row justify-end w-full">
          <Text className="text-white pr-2 pt-1">Sign out</Text>
          <TouchableOpacity onPress={logout} className="flex mb-10">
            <Image source={Logout} resizeMode="contain" className="w-6 h-6" />
          </TouchableOpacity>
        </View>
        <View className="w-full items-center mt-5">
          <Text className="text-white text-3xl font-normal">
            Welcome{" "}
            <Text className="text-yellow-600 font-semibold">{username}</Text>
          </Text>
        </View>

        <View className="items-center mt-10">
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          ) : (
            <Text className="text-white">No image selected</Text>
          )}
          <Button title="Pick Image" onPress={pickImage} />
        </View>
      </View>
    </AppGradient>
  );
};

export default Profile;
