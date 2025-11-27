import { useEffect } from "react";
import { Stack } from "expo-router";
import { initDatabase } from "../utils/database";

export default function RootLayout() {
  useEffect(() => {
    // Initialize database when app starts
    initDatabase();
  }, []);

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="camera"
        options={{ 
          title: "錄製 Vlog",
          presentation: "modal"
        }}
      />
    </Stack>
  );
}
