import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#F2F2F7",
          borderTopWidth: 1,
          borderTopColor: "#C6C6C8",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "情緒記錄",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>😊</Text>,
        }}
      />
      <Tabs.Screen
        name="vlog"
        options={{
          title: "Vlog",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📹</Text>,
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          title: "位置",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📍</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "設定",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
