import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { initDB, seedDefaultWorkouts } from "../src/services/database";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    initDB()
      .then((db) => {
        console.log("Database initialized");
        return seedDefaultWorkouts(db);
      })
      .then(() => {
        console.log("Default workouts seeded successfully");
        setDbInitialized(true);
      })
      .catch((err) => {
        console.error("DB init failed:", err);
      });
  }, []);

  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
