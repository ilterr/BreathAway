import { View, Text, Task, Image } from "react-native";
import React, { useEffect } from "react";
import AppGradient from "@/components/AppGradient";
import { useState } from "react";
import { Databases, Query } from "react-native-appwrite";
import { client, config } from "../../lib/appwrite";
import { ScrollView } from "react-native";

const databases = new Databases(client);

interface Routine {
  $title: string;
  $img: string;
  $instructions: string;
  $description: string;
}

const Home = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    const getRoutines = async () => {
      try {
        const result = await databases.listDocuments(
          config.databaseId,
          config.routinesCollectionId,
          [Query.select(["title", "img", "instructions", "description"])]
        );
        if (result) {
          setRoutines(
            result.documents.map((doc) => ({
              $title: doc.title,
              $img: doc.img,
              $instructions: doc.instructions,
              $description: doc.description,
            })) as Routine[]
          );
        }
      } catch (error) {
        throw new Error();
      }
    };
    getRoutines();
  }, []);

  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-2xl font-bold">Your Routines</Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          className="w-full h-full"
        >
          {routines.map((routine, index) => (
            <>
              <View
                key={index}
                className="w-64 h-64 m-4   justify-center items-center relative"
              >
                <Image
                  source={{ uri: routine.$img }}
                  className="w-full h-full object-cover absolute"
                />
                <Text className="text-white text-lg font-bold z-10 relative">
                  {routine.$title}
                </Text>
              </View>
              <View key={index + 100} className="w-full">
                <Text className="text-white mt-2">{routine.$description}</Text>
              </View>
            </>
          ))}
        </ScrollView>
      </View>
    </AppGradient>
  );
};

export default Home;
