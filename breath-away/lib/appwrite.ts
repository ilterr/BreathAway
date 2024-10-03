import { Client, Account, ID, Databases, Query, Storage } from "react-native-appwrite";
import * as ImagePicker from 'expo-image-picker'

export const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ?? "",
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM ?? "",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? "",
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID ?? "",
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID ?? "",
  routinesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_ROUTINES_COLLECTION_ID ?? "",
    storageId: '66fe812e003170e73c2c'
};

export const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email: string, password: string, username: string) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username);

    if (!newAccount) throw new Error("Failed to create account");

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
      }
    );

    return newUser;
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw new Error(error);
  }
};


export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    console.error("Error signing in:", error);
    throw new Error(error);
  }
};


export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("No current account found");

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw new Error("No user found");

    return currentUser.documents[0];
  } catch (error: any) {
    console.error("Error getting current user:", error);
    throw new Error(error);
  }
};


export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error: any) {
    console.error("Error signing out:", error);
    throw new Error(error);
  }
};


export const getRoutines = async () => {
  try {
    const result = await databases.listDocuments(
      config.databaseId,
      config.routinesCollectionId,
      [Query.select(["title", "img", "instructions", "description"])]
    );

    return result;
  } catch (error) {
    console.error("Error getting routines:", error);
    throw new Error(error);
  }
};

export const uploadImage = async (fileUri: string, mimeType: string) => {
  try {

    const response = await fetch(fileUri);
    const blob = await response.blob();


    if (blob.size === 0) {
      throw new Error('The image is empty or failed to load.');
    }

    const file = new File([blob], 'image.jpg', { type: mimeType });


    const uploadedFile = await storage.createFile(config.storageId, ID.unique(), file);

    console.log("Uploaded image:", uploadedFile);
    return uploadedFile;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error(error);
  }
};


export const pickImage = async () => {
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

    if (!result.canceled) {
      return result.assets[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error picking image:", error);
    return null;
  }
};