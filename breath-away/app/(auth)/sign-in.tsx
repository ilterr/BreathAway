import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import AppGradient from "@/components/AppGradient";
import Logo from "../../assets/images/logo.png";
import { useGlobalContext } from "@/context/GlobalProvider";
import AppwriteService from "@/lib/appwrite";

interface User {
  id: string;
  name: string;
  email: string;
}

interface FormData {
  email: string;
  password: string;
}

function SignIn() {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
  });

  const submit = async (): Promise<void> => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await AppwriteService.signIn(form.email, form.password);
      const result = await AppwriteService.getCurrentUser();
      const user: User | null = transformDocumentToUser(result);

      if (user) {
        setUser(user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }

      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Oops!", "Incorrect credentials used, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const transformDocumentToUser = (document: any): User | null => {
    if (!document) return null;

    return {
      id: document.$id,
      name: document.name,
      email: document.email,
    };
  };

  return (
    <AppGradient colors={["#2E2E2E", "#424242", "#575757", "#6b6b6b"]}>
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6 items-center">
          <View className="flex justify-center items-center">
            <Image
              source={Logo}
              resizeMode="contain"
              className="w-[325px] h-[150px]"
            />
          </View>
          <Text className="text-2xl text-white mt-9 font-semibold">
            Log in to BreathAway
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <CustomButton

            title="Sign in"
            onPress={submit}
            containerStyles="mt-7 w-3/4"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-regular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-semibold text-yellow-600"
            >
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </AppGradient>
  );
}

export default SignIn;
