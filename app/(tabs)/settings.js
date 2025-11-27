import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { getDataStats, exportAllData, clearAllData } from "../../utils/database";

export default function SettingsScreen() {
  const [stats, setStats] = useState(null);
  const [exporting, setExporting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    const currentStats = await getDataStats();
    setStats(currentStats);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const result = await exportAllData();
      if (result.success) {
        Alert.alert(
          "✅ 導出成功",
          "數據已導出！請將檔案儲存到 data 資料夾中。",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("❌ 導出失敗", result.error, [{ text: "OK" }]);
      }
    } catch (error) {
      Alert.alert("❌ 錯誤", error.message, [{ text: "OK" }]);
    } finally {
      setExporting(false);
    }
  };

  const handleClear = () => {
    Alert.alert(
      "⚠️ 確認清除",
      "確定要清除所有數據嗎？此操作無法復原。",
      [
        { text: "取消", style: "cancel" },
        {
          text: "清除",
          style: "destructive",
          onPress: async () => {
            await clearAllData();
            loadStats();
            Alert.alert("✅ 已清除", "所有數據已清除", [{ text: "OK" }]);
          },
        },
      ]
    );
  };

  const renderStatCard = (title, emoji, count, timeSpan, requirement) => {
    const meetsCount = count >= 3;
    const meetsTime = timeSpan > 12;
    const meetsAll = meetsCount && meetsTime;

    return (
      <View style={[styles.statCard, meetsAll && styles.statCardSuccess]}>
        <View style={styles.statHeader}>
          <Text style={styles.statEmoji}>{emoji}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          {meetsAll && <Text style={styles.checkmark}>✅</Text>}
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>記錄數量</Text>
          <Text style={[styles.statValue, meetsCount && styles.statValueSuccess]}>
            {count} 筆 {meetsCount ? "✓" : `(需要 ≥3)`}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>時間跨度</Text>
          <Text style={[styles.statValue, meetsTime && styles.statValueSuccess]}>
            {timeSpan.toFixed(2)} 小時 {meetsTime ? "✓" : `(需要 >12)`}
          </Text>
        </View>
        <Text style={styles.statType}>{requirement}</Text>
      </View>
    );
  };

  const allRequirementsMet = stats && 
    stats.mood.count >= 3 && stats.mood.timeSpanHours > 12 &&
    stats.vlog.count >= 3 && stats.vlog.timeSpanHours > 12 &&
    stats.location.count >= 3 && stats.location.timeSpanHours > 12;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>⚙️ 設定 & 導出</Text>
      <Text style={styles.subtitle}>查看數據統計並導出資料</Text>

      {/* Requirements status */}
      <View style={[styles.statusBanner, allRequirementsMet ? styles.statusBannerSuccess : styles.statusBannerWarning]}>
        <Text style={styles.statusText}>
          {allRequirementsMet 
            ? "🎉 已符合所有作業要求！可以導出數據了！"
            : "⚠️ 尚未符合作業要求，請繼續收集數據"
          }
        </Text>
      </View>

      {/* Stats */}
      {stats && (
        <>
          {renderStatCard(
            "情緒問卷",
            "😊",
            stats.mood.count,
            stats.mood.timeSpanHours,
            "structured active/foreground data"
          )}
          {renderStatCard(
            "1秒 Vlog",
            "📹",
            stats.vlog.count,
            stats.vlog.timeSpanHours,
            "unstructured active/foreground data"
          )}
          {renderStatCard(
            "GPS 座標",
            "📍",
            stats.location.count,
            stats.location.timeSpanHours,
            "structured passive/background data"
          )}
        </>
      )}

      {/* Buttons */}
      <TouchableOpacity
        style={[styles.exportButton, exporting && styles.buttonDisabled]}
        onPress={handleExport}
        disabled={exporting}
      >
        <Text style={styles.exportButtonText}>
          {exporting ? "導出中..." : "📥 導出所有數據"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.refreshButton} onPress={loadStats}>
        <Text style={styles.refreshButtonText}>🔄 刷新統計</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
        <Text style={styles.clearButtonText}>🗑️ 清除所有數據</Text>
      </TouchableOpacity>

      {/* Instructions */}
      <View style={styles.instructionBox}>
        <Text style={styles.instructionTitle}>📋 作業提交說明</Text>
        <Text style={styles.instructionText}>
          1. 收集數據：每種類型至少 3 筆，時間跨度 {">"}12 小時{"\n"}
          2. 點擊「導出所有數據」{"\n"}
          3. 將導出的 JSON 檔案放入 data 資料夾{"\n"}
          4. 提交 GitHub repo 連結到 COOL
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
    marginBottom: 20,
  },
  statusBanner: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statusBannerSuccess: {
    backgroundColor: "#D4EDDA",
  },
  statusBannerWarning: {
    backgroundColor: "#FFF3CD",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#E5E5EA",
  },
  statCardSuccess: {
    borderLeftColor: "#34C759",
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  statTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  checkmark: {
    fontSize: 18,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  statLabel: {
    fontSize: 14,
    color: "#8E8E93",
  },
  statValue: {
    fontSize: 14,
    color: "#FF9500",
  },
  statValueSuccess: {
    color: "#34C759",
    fontWeight: "600",
  },
  statType: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 8,
    fontStyle: "italic",
  },
  exportButton: {
    backgroundColor: "#007AFF",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 12,
  },
  buttonDisabled: {
    backgroundColor: "#A8A8A8",
  },
  exportButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  refreshButton: {
    backgroundColor: "#34C759",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginTop: 12,
  },
  refreshButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  clearButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginTop: 12,
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  instructionBox: {
    backgroundColor: "#E8F4FD",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1565C0",
  },
  instructionText: {
    fontSize: 13,
    color: "#1565C0",
    lineHeight: 22,
  },
});
