import React from "react";
import { Stack } from "expo-router";
import GlobalProvider from "@/context/GlobalProvider";

const RootLayout = () => {
  return (
    <GlobalProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </GlobalProvider>
  );
};

export default RootLayout;
