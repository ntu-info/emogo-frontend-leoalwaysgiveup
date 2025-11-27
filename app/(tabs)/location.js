import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { saveLocationEntry, getLocationEntries } from "../../utils/database";

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentLocations, setRecentLocations] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    checkPermission();
    loadRecentLocations();
  }, []);

  const checkPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setHasPermission(status === "granted");
    return status === "granted";
  };

  const loadRecentLocations = async () => {
    const locations = await getLocationEntries();
    setRecentLocations(locations.slice(0, 10));
  };

  const getCurrentLocation = async () => {
    setLoading(true);

    try {
      // Check permission
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          Alert.alert("❌ 錯誤", "需要位置權限才能記錄 GPS 座標", [{ text: "OK" }]);
          setLoading(false);
          return;
        }
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude, accuracy } = currentLocation.coords;
      setLocation({ latitude, longitude, accuracy });

      // Save to database
      await saveLocationEntry(latitude, longitude, accuracy);

      Alert.alert(
        "✅ 成功",
        `GPS 座標已儲存！\n緯度: ${latitude.toFixed(6)}\n經度: ${longitude.toFixed(6)}`,
        [{ text: "OK" }]
      );

      loadRecentLocations();
    } catch (error) {
      console.error("Location error:", error);
      Alert.alert("❌ 錯誤", "取得位置失敗：" + error.message, [{ text: "OK" }]);
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionBox}>
          <Text style={styles.permissionTitle}>📍 需要位置權限</Text>
          <Text style={styles.permissionText}>
            此功能需要存取你的位置來記錄 GPS 座標
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>授予權限</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>📍 GPS 定位</Text>
      <Text style={styles.subtitle}>記錄你的位置座標</Text>

      {/* Current location display */}
      <View style={styles.locationCard}>
        <Text style={styles.cardTitle}>目前位置</Text>
        {location ? (
          <View>
            <View style={styles.coordRow}>
              <Text style={styles.coordLabel}>緯度 (Lat)</Text>
              <Text style={styles.coordValue}>{location.latitude.toFixed(6)}</Text>
            </View>
            <View style={styles.coordRow}>
              <Text style={styles.coordLabel}>經度 (Lng)</Text>
              <Text style={styles.coordValue}>{location.longitude.toFixed(6)}</Text>
            </View>
            <View style={styles.coordRow}>
              <Text style={styles.coordLabel}>精確度</Text>
              <Text style={styles.coordValue}>{location.accuracy?.toFixed(1) || "N/A"} m</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noLocation}>尚未取得位置</Text>
        )}
      </View>

      {/* Get location button */}
      <TouchableOpacity
        style={[styles.locationButton, loading && styles.locationButtonDisabled]}
        onPress={getCurrentLocation}
        disabled={loading}
      >
        <Text style={styles.locationButtonText}>
          {loading ? "取得中..." : "📍 記錄目前位置"}
        </Text>
      </TouchableOpacity>

      {/* Recent locations */}
      <View style={styles.recentContainer}>
        <Text style={styles.recentTitle}>最近記錄 ({recentLocations.length})</Text>
        {recentLocations.map((loc) => (
          <View key={loc.id} style={styles.recentItem}>
            <View style={styles.recentLeft}>
              <Text style={styles.recentCoords}>
                {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
              </Text>
              <Text style={styles.recentTime}>
                {new Date(loc.timestamp).toLocaleString()}
              </Text>
            </View>
            <Text style={styles.recentIcon}>📍</Text>
          </View>
        ))}
        {recentLocations.length === 0 && (
          <Text style={styles.noRecords}>還沒有位置記錄</Text>
        )}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 提示：GPS 座標為被動/背景數據。作業要求至少 3 筆記錄，時間跨度 {">"}12 小時。
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#1C1C1E",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#8E8E93",
    marginBottom: 24,
  },
  locationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 12,
  },
  coordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  coordLabel: {
    fontSize: 14,
    color: "#8E8E93",
  },
  coordValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  noLocation: {
    color: "#8E8E93",
    fontStyle: "italic",
    textAlign: "center",
  },
  locationButton: {
    backgroundColor: "#007AFF",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
  },
  locationButtonDisabled: {
    backgroundColor: "#A8A8A8",
  },
  locationButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  recentContainer: {
    marginTop: 24,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  recentItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recentLeft: {
    flex: 1,
  },
  recentCoords: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  recentTime: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  recentIcon: {
    fontSize: 20,
  },
  noRecords: {
    color: "#8E8E93",
    fontStyle: "italic",
    textAlign: "center",
    padding: 20,
  },
  permissionBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  infoText: {
    fontSize: 13,
    color: "#1565C0",
    lineHeight: 20,
  },
});

